import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface vol {
  id: number;
  user_id: user_id;
}

export function VolunteerDetails({ volId }: { volId: number }) {
  const session = useSession();
  // const { data, loading, error, refetch, abort } = useFetch<vol>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volById/${volId}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );
  
  const {data,isLoading,isError,isRefetching} = useQuery({
    queryKey: ['volDetails', Number(volId)],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volById/${volId}`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return await res.json();
    },
    refetchOnMount: true,
    staleTime: 30000,
    enabled: !!session.data?.user.auth_token,
    refetchInterval: 10000,
  });
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Details</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {isError && (
            <div>Error fetching data</div>
          )}
          {!isError && isLoading && (
            <div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          )}
          {!isError && !isLoading && data?.user_id && (
            <div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    {data.user_id.name}
                  </h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="email">Email</Label>
                    <div className="col-span-2 h-6">{data.user_id.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
