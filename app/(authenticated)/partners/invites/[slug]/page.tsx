"use client";
import { AddVolunteer } from "@/components/admin/AddVolunteer";
import { VolunteerInviteTable } from "@/components/admin/VolunteerInviteTable";
import { columns } from "@/components/admin/VolunteerInviteColumn";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { useQuery, useIsFetching } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Refetching from "@/components/Refetching";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = useSession();

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface pocForVol {
    id: number;
  }

  // interface vol {
  //   id: number;
  //   poc: pocForVol;
  //   user_id: user_id;
  // }
  interface vol {
    id: number;
    name: string;
    email: string;
    role: string;
    Poc: string;
    closed: string;
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
      queryKey: ["volInviteList"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/volinvites/${params.slug}`,
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
        console.log(res);
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
            <div className=" text-sm">Volunteer Invites</div>
          </div>
        </div>
        {isRefetching && <Refetching />}
        {!isError && isLoading && <Loading />}
        {!isError && !isLoading && data && data.constructor === Array && (
          <div className="overflow-x-auto">
            {isRefetching && <Refetching />}
            {data && data.constructor === Array && (
              <div>
                <VolunteerInviteTable columns={columns} data={data} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
