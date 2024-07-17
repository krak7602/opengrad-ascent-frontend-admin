"use client";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { useListState } from "@mantine/hooks";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  interface poc_user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface poc {
    id: number;
    user_id: poc_user_id;
  }

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface poc_user {
    id: number;
  }

  interface vol {
    id: number;
    poc: poc_user;
    user_id: user_id;
  }

  const session = useSession();
  const [volData, setVolData] = useListState<vol>();
  const [selectedPartner, setSelectedPartner] = useState<poc>();
  const [selectedVolunteer, setSelectedVolunteer] = useState<vol>();
  const [psOpen, setPSOpen] = useState(false);
  const [vsOpen, setVSOpen] = useState(false);
  const partnersData = useFetch<poc[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
    {
      headers: {
        authorization: `bearer ${session.data?.user.auth_token}`,
      },
    },
  );

  return (
    <div className="container mx-auto my-6 px-2 lg:px-8">
      <Popover open={psOpen} onOpenChange={setPSOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={psOpen}
            className="lg:w-fit w-full font-light py-3 rounded-lg px-3 mb-2 flex justify-center items-center mr-2"
          >
            <div className="hidden md:block mx-2">Select Partner</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Add Recipient" />
            <CommandList>
              <CommandEmpty>No recipient found.</CommandEmpty>
              <CommandGroup>
                {partnersData.data?.map((pt) => (
                  <CommandItem
                    key={pt.id}
                    value={pt.user_id.name}
                    onSelect={(currentValue) => {
                      setSelectedPartner(pt);
                      setPSOpen(false);
                    }}
                  >
                    {selectedPartner?.user_id.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover open={vsOpen} onOpenChange={setVSOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={vsOpen}
            className="lg:w-fit w-full font-light py-3 rounded-lg px-3  mb-2 flex justify-center items-center mr-2"
          >
            <div className="hidden md:block mx-2">Select Volunteer</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Add Recipient" />
            <CommandList>
              <CommandEmpty>No recipient found.</CommandEmpty>
              <CommandGroup>
                {volData.map((vl) => (
                  <CommandItem
                    key={vl.id}
                    value={vl.user_id.name}
                    onSelect={(currentValue) => {
                      setSelectedVolunteer(vl);
                      setPSOpen(false);
                    }}
                  >
                    {selectedVolunteer?.user_id.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
