"use client";
import { AddVolunteer } from "@/components/admin/AddVolunteer";
import { VolunteerTable } from "@/components/admin/VolunteerTable";
import { columns } from "@/components/admin/VolunteerColumn";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { useQuery, useIsFetching } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Refetching from "@/components/Refetching";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = useSession();
  const router = useRouter();

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface pocForVol {
    id: number;
  }

  interface vol {
    id: number;
    poc: pocForVol;
    user_id: user_id;
  }

  interface poc {
    id: number;
    user_id: user_id;
  }

  // const { data, loading, error, refetch, abort } = useFetch<vol[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volbyPoc/${params.slug}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );
  const { data, isLoading, isError, isSuccess, isRefetching } = useQuery<vol[]>(
    {
      queryKey: ["vol"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volbyPoc/${params.slug}`,
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
        return res.json();
      },
      refetchOnMount: true,
      staleTime: 30000,
      refetchInterval: 30000,
      enabled: !!session.data?.user.auth_token,
    },
  );

  // const pocData = useFetch<poc>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/pocById/${params.slug}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );

  const pocData = useQuery<poc>({
    queryKey: ["pocData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/pocById/${params.slug}`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return res.json();
    },
    refetchOnMount: true,
    staleTime: 30000,
    refetchInterval: 30000,
    enabled: !!session.data?.user.auth_token,
  });

  return (
    <>
      {isError && <Error />}
      <div className="container mx-auto my-6 px-2 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-2 py-4 rounded bg-primary text-white px-4">
          <div className=" pb-1">
            {pocData.data && (
              <div>
                <h1 className="text-2xl font-bold">
                  {pocData.data?.user_id.name}
                </h1>
              </div>
            )}
            <div className=" text-sm">Volunteer</div>
          </div>
          <div className="flex w-full gap-2 flex-row justify-end">
            <Button
              variant="outline"
              onClick={() => {
                router.push(`/partners/invites/${params.slug}`);
              }}
            >
              <MailAccountIcon />
            </Button>
            <div className=" text-black">
              <AddVolunteer id={Number(params.slug)} />
            </div>
          </div>
        </div>
        {!isError && isLoading && <Loading />}
        {!isError && !isLoading && data && data.constructor === Array && (
          <div className="overflow-x-auto">
            {isRefetching && <Refetching />}
            {data && data.constructor === Array && (
              <div>
                <VolunteerTable columns={columns} data={data} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const MailAccountIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M2 5L8.91302 8.92462C11.4387 10.3585 12.5613 10.3585 15.087 8.92462L22 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M21.996 10.5024C21.9933 10.1357 21.9894 9.77017 21.9842 9.5265C21.9189 6.46005 21.8862 4.92682 20.7551 3.79105C19.6239 2.65528 18.0497 2.61571 14.9012 2.53658C12.9607 2.48781 11.0393 2.48781 9.09882 2.53657C5.95033 2.6157 4.37608 2.65526 3.24495 3.79103C2.11382 4.92681 2.08114 6.46003 2.01576 9.52648C1.99474 10.5125 1.99475 11.4926 2.01577 12.4786C2.08114 15.5451 2.11383 17.0783 3.24496 18.2141C4.37608 19.3498 5.95033 19.3894 9.09883 19.4685C9.7068 19.4838 10.4957 19.4943 11 19.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.586 18.6482C14.9572 19.0167 13.3086 19.7693 14.3127 20.711C14.8032 21.171 15.3495 21.5 16.0364 21.5H19.9556C20.6424 21.5 21.1887 21.171 21.6792 20.711C22.6834 19.7693 21.0347 19.0167 20.4059 18.6482C18.9314 17.7839 17.0605 17.7839 15.586 18.6482Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19.996 14C19.996 15.1046 19.1005 16 17.996 16C16.8914 16 15.996 15.1046 15.996 14C15.996 12.8954 16.8914 12 17.996 12C19.1005 12 19.996 12.8954 19.996 14Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
