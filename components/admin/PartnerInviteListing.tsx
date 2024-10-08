import { AddPartner } from "@/components/admin/AddPartner";
import { PartnerInviteTable } from "@/components/admin/PartnerInviteTable";
import { columns } from "@/components/admin/PartnerInviteColumn";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { useQuery, useIsFetching } from "@tanstack/react-query";
import Loading from "../Loading";
import Error from "../Error";
import Refetching from "../Refetching";

export default function PartnerInviteListing() {
  interface poc {
    id: number;
    name: string;
    email: string;
    role: string;
    closed: string;
  }

  const session = useSession();
  // const { data, loading, error, refetch, abort } = useFetch<poc[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );

  // TODO: Change the request to partner
  const { data, isLoading, isError, isSuccess, isRefetching } = useQuery<poc[]>(
    {
      queryKey: ["pocInviteList"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/pocinvites`,
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

  return (
    <>
      {isRefetching && <Refetching/>}
      {isError && <Error />}
      {!isError && isLoading && <Loading />}
      {!isError && !isLoading && data && (
        <div className="container mx-auto my-6 px-2 lg:px-8">
          {isRefetching && <Refetching />}
          <div className="flex flex-col lg:flex-row items-start justify-between mb-2 py-4 rounded bg-primary text-white px-4">
            <h1 className="text-2xl pb-1 font-bold">Partner Invites</h1>
          </div>
          <div className="overflow-x-auto">
            {data && data.constructor === Array && (
              <div>
                <PartnerInviteTable columns={columns} data={data} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
