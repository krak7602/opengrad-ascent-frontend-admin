import { AddCohort } from "@/components/admin/AddCohort";
import { CohortTable } from "@/components/admin/CohortTable";
import { columns } from "@/components/admin/CohortColumn";
import { useFetch } from "@/lib/useFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Error from "../Error";
import Loading from "../Loading";
import Refetching from "../Refetching";

export default function CohortListing() {
  const session = useSession();
  interface cohortColumn {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  }
  const { data, isError, isLoading, isSuccess,isRefetching } = useQuery({
    queryKey: ["cohort"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/all`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        }
      );
      return res.json();
    },
    refetchOnMount: true,
    enabled: !!session.data?.user.auth_token,
  });
  // const { data, loading, error, refetch, abort } = useFetch<cohortColumn[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/all`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );
  const loading = true;
  return (
    <div>
      {isError && <Error />}
      {!isError && isLoading && <Loading />}
      {!isError && !isLoading && data && (
        <div className="container mx-auto my-6 px-2 lg:px-8">
          {isRefetching && <Refetching />}
          <div className="flex flex-col lg:flex-row items-start justify-between mb-2 py-4 rounded bg-primary text-white px-4">
            <div className=" pb-1">
              <h1 className="text-2xl font-bold">Cohorts</h1>
            </div>
            <div className="flex w-full flex-row justify-end">
              <div className=" text-black">
                <AddCohort />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {data && data.constructor === Array && (
              <div>
                <CohortTable columns={columns} data={data} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
