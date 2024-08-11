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
import { useQuery } from "@tanstack/react-query";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import Refetching from "@/components/Refetching";
import { useQueryClient } from "@tanstack/react-query";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = useSession();
  const queryClient = useQueryClient();

  interface cohortColumn {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  }

  const cohortData = useQuery<cohortColumn[]>({
    queryKey: ["cohortListingFeedback"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/all`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return res.json();
    },
    refetchOnMount: true,
    enabled: !!session.data?.user.auth_token,
  });
  // const cohortData = useFetch<cohortColumn[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/all`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );
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

  const partnerData = useQuery<poc[]>({
    queryKey: ["partnerListingFeedback"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return res.json();
    },
    refetchOnMount: true,
    enabled: !!session.data?.user.auth_token,
  });

  // const partnerData = useFetch<poc[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );

  const [recipientCohortCount, setRecipientCohortCount] = useState(0);
  const [recipientPartnerCount, setRecipientPartnerCount] = useState(0);
  const [recipientCohorts, setRecipientCohorts] = useListState<cohortColumn>(
    [],
  );
  const [recipientPartners, setRecipientPartners] = useListState<poc>([]);
  const [open, setOpen] = useState(false);
  const [cohortAdd, setCohortAdd] = useState(false);
  const [partnerAdd, setPartnerAdd] = useState(true);

  const AddCohort = async (selectedCohort: cohortColumn) => {
    if (cohortData.data) {
      cohortData.data.forEach((element) => {
        if (element.name === selectedCohort.name) {
          setRecipientCohorts.setState([element]);
          setRecipientCohortCount(1);
          setRecipientPartners.setState([]);
          setRecipientPartnerCount(0);
        }
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["notifDataCohort"],
      // });
    }
  };

  const AddPartner = async (selectedPartner: poc) => {
    if (partnerData.data) {
      partnerData.data.forEach((element) => {
        if (element.user_id.name === selectedPartner.user_id.name) {
          setRecipientPartners.setState([element]);
          setRecipientPartnerCount(1);
          setRecipientCohorts.setState([]);
          setRecipientCohortCount(0);
        }
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["notifDataPoc"],
      // });
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

  const notifDataCohort = useQuery<notif[]>({
    queryKey: ["notifDataCohort"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/get/${recipientCohorts[0]?.id}`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return res.json();
    },
    refetchOnMount: true,
    enabled: !!session.data?.user.auth_token,
  });

  // const notifDataCohort = useFetch<notif[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/get/${recipientCohorts[0]?.id}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session, recipientCohorts, recipientPartners],
  // );
  // const { data: notifDataCohort,isLoading:notifCohortLoading,isError:notifCohortError} = useQuery({
  //   queryKey: [
  //     "NotiCohort",
  //     Number(recipientCohorts[0]?.id),
  //     Number(recipientPartners[0]?.id),
  //   ],
  //   queryFn: async () => {
  //     const resCohort = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/get/${recipientCohorts[0]?.id}`,
  //       {
  //         headers: {
  //           authorization: `Bearer ${session.data?.user.auth_token}`,
  //         },
  //       }
  //     );
  //     return resCohort.json();
  //   },
  //   refetchInterval: 30000,
  //   staleTime: 30000,
  //   enabled: !!session.data?.user.auth_token,
  //   refetchOnMount: true,
  // });

  const notifDataPoc = useQuery<notif[]>({
    queryKey: ["notifDataPoc"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/get/${recipientPartners[0]?.id}`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return res.json();
    },
    refetchOnMount: true,
    enabled: !!session.data?.user.auth_token,
  });

  // const notifDataPoc = useFetch<notif[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/get/${recipientPartners[0]?.id}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session, recipientCohorts, recipientPartners],
  // );
  // const { data: notifDataPoc ,isLoading:notifPocLoading,isError:notifPocError} = useQuery({
  //   queryKey: [
  //     "NotiPoc",
  //     Number(recipientCohorts[0]?.id),
  //     Number(recipientPartners[0]?.id),
  //   ],
  //   queryFn: async () => {
  //     const resPoc = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/get/${recipientPartners[0]?.id}`,
  //       {
  //         headers: {
  //           authorization: `Bearer ${session.data?.user.auth_token}`,
  //         },
  //       }
  //     );
  //     return resPoc.json();
  //   },
  //   refetchInterval: 30000,
  //   staleTime: 30000,
  //   enabled: !!session.data?.user.auth_token,
  //   refetchOnMount: true,
  // });

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
            <div className="flex w-full flex-col items-start rounded-md border px-1 py-1">
              <div className="flex w-full flex-row px-1 py-1 items-center justify-between">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="lg:w-fit w-full font-light py-3 rounded-lg px-3 flex justify-center items-center mr-2"
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
                                        AddPartner(partner).then(() => {
                                          queryClient.invalidateQueries({
                                            queryKey: ["notifDataPoc"],
                                          });
                                        });
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
                                        AddCohort(cohort).then(() => {
                                          queryClient.invalidateQueries({
                                            queryKey: ["notifDataCohort"],
                                          });
                                        });
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
                  className=" ml-1 gap-0 rounded bg-slate-200"
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
            <div>
              {notifDataCohort.isError && <Error />}
              {!notifDataCohort.isError && notifDataCohort.isLoading && (
                <Loading />
              )}
              {!notifDataCohort.isError &&
                !notifDataCohort.isLoading &&
                notifDataCohort.data &&
                recipientCohortCount == 1 &&
                notifDataCohort.data.constructor === Array && (
                  <div>
                    <NotificationTable
                      columns={columns}
                      data={[...notifDataCohort.data].reverse()}
                    />
                  </div>
                )}
            </div>
            {/* {notifDataCohort.data &&
              notifDataCohort.data.constructor === Array && (
                <div>
                  <NotificationTable
                    columns={columns}
                    data={[...notifDataCohort.data].reverse()}
                  />
                </div>
              )} */}
            <div>
              {notifDataPoc.isError && <Error />}
              {!notifDataPoc.isError && notifDataPoc.isLoading && <Loading />}
              {!notifDataPoc.isError &&
                !notifDataPoc.isLoading &&
                notifDataPoc.data &&
                recipientPartnerCount == 1 &&
                notifDataPoc.data.constructor === Array && (
                  <div>
                    <NotificationTable
                      columns={columns}
                      data={[...notifDataPoc.data].reverse()}
                    />
                  </div>
                )}
            </div>
            {/* {notifDataPoc.data && notifDataPoc.data.constructor === Array && (
              <div>
                <NotificationTable
                  columns={columns}
                  data={[...notifDataPoc.data].reverse()}
                />
              </div>
            )} */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
