"use client";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import FeedbackForm from "@/components/admin/FeedbackForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/lib/useFetch";
import { NotificationTable } from "@/components/admin/NotificationTable";
import { columns } from "@/components/admin/NotificationColumn";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = useSession();

  interface cohortColumn {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  }
  const cohortData = useFetch<cohortColumn[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/all`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );
  interface poc {
    id: number;
    user_id: user_id;
  }

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  const partnerData = useFetch<poc[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );

  const [recipientCohortCount, setRecipientCohortCount] = useState(0);
  const [recipientPartnerCount, setRecipientPartnerCount] = useState(0);
  const [recipientCohorts, setRecipientCohorts] = useListState<cohortColumn>(
    [],
  );
  const [recipientPartners, setRecipientPartners] = useListState<poc>([]);
  const [open, setOpen] = useState(false);
  const [cohortAdd, setCohortAdd] = useState(false);
  const [partnerAdd, setPartnerAdd] = useState(true);

  const AddCohort = (selectedCohort: cohortColumn) => {
    if (cohortData.data) {
      cohortData.data.forEach((element) => {
        if (element.name === selectedCohort.name) {
          setRecipientCohorts.setState([element]);
          setRecipientCohortCount(1);
        }
      });
    }
  };

  const AddPartner = (selectedPartner: poc) => {
    if (partnerData.data) {
      partnerData.data.forEach((element) => {
        if (element.user_id.name === selectedPartner.user_id.name) {
          setRecipientPartners.setState([element]);
          setRecipientPartnerCount(1);
        }
      });
    }
  };

  const toggleClick = (option: string) => {
    if (option === "cohorts") {
      setCohortAdd(!cohortAdd);
      setPartnerAdd(false);
      setRecipientCohorts.setState([]);
      setRecipientCohortCount(0);
      setRecipientPartners.setState([]);
      setRecipientPartnerCount(0);
    } else if (option === "partners") {
      setCohortAdd(false);
      setPartnerAdd(!partnerAdd);
      setRecipientCohorts.setState([]);
      setRecipientCohortCount(0);
      setRecipientPartners.setState([]);
      setRecipientPartnerCount(0);
    }
  };

  interface notif {
    id: number;
    typeofnotification: "form";
    Message: string;
    form_id: number;
    receipient_id: number[];
  }
  const notifDataCohort = useFetch<notif[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/get/${recipientCohorts[0]?.id}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session, recipientCohorts, recipientPartners],
  );

  const notifDataPoc = useFetch<notif[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/get/${recipientPartners[0]?.id}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session, recipientCohorts, recipientPartners],
  );

  return (
    <div>
      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">New Form</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <FeedbackForm />
        </TabsContent>
        <TabsContent value="search">
          <div className="overflow-x-auto px-1 pt-2">
            <div className="flex w-full flex-col items-start rounded-md border px-3 py-3">
              <div className="flex w-full flex-row px-1 py-1 items-center justify-between">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="lg:w-fit w-full font-light py-3 rounded-lg px-3  mb-2 flex justify-center items-center mr-2"
                    >
                      <div className="mx-2">
                        {recipientCohortCount != 0 && (
                          <div>{recipientCohorts[0]?.name}</div>
                        )}
                        {recipientPartnerCount != 0 && (
                          <div>{recipientPartners[0]?.user_id?.name}</div>
                        )}
                        {recipientCohortCount == 0 &&
                          recipientPartnerCount == 0 && (
                            <div>Select recipient</div>
                          )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  {partnerAdd && (
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Add Recipient" />
                        <CommandList>
                          <CommandEmpty>No recipient found.</CommandEmpty>
                          <CommandGroup>
                            {partnerData.data &&
                              partnerData.data.constructor === Array && (
                                <div>
                                  {partnerData.data.map((partner) => (
                                    <CommandItem
                                      key={partner.id}
                                      value={partner.user_id.name}
                                      onSelect={(currentValue) => {
                                        AddPartner(partner);
                                        setOpen(false);
                                      }}
                                    >
                                      {partner.user_id.name}
                                    </CommandItem>
                                  ))}
                                </div>
                              )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  )}
                  {cohortAdd && (
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Add Recipient" />
                        <CommandList>
                          <CommandEmpty>No recipient found.</CommandEmpty>
                          <CommandGroup>
                            {cohortData.data &&
                              cohortData.data.constructor === Array && (
                                <div>
                                  {cohortData.data.map((cohort) => (
                                    <CommandItem
                                      key={cohort.id}
                                      value={cohort.name}
                                      onSelect={(currentValue) => {
                                        AddCohort(cohort);
                                        setOpen(false);
                                      }}
                                    >
                                      {cohort.name}
                                    </CommandItem>
                                  ))}
                                </div>
                              )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
                <ToggleGroup
                  type="single"
                  defaultValue="partners"
                  className=" ml-1 gap-0 mb-2 rounded bg-slate-200"
                >
                  <ToggleGroupItem
                    className=" px-2 font-light rounded-l-sm rounded-r-none data-[state=on]:bg-primary data-[state=on]:text-white"
                    onClick={() => toggleClick("partners")}
                    value="partners"
                  >
                    <div className=" text-xs">Partners</div>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className=" px-2  font-light rounded-l-none rounded-r-sm data-[state=on]:bg-primary data-[state=on]:text-white"
                    onClick={() => toggleClick("cohorts")}
                    value="cohorts"
                  >
                    <div className=" text-xs">Cohorts</div>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            {notifDataCohort.data &&
              notifDataCohort.data.constructor === Array && (
                <div>
                  <NotificationTable
                    columns={columns}
                    data={[...notifDataCohort.data].reverse()}
                  />
                </div>
              )}
            {notifDataPoc.data && notifDataPoc.data.constructor === Array && (
              <div>
                <NotificationTable
                  columns={columns}
                  data={[...notifDataPoc.data].reverse()}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
