"use client";
import { AddVolunteer } from "@/components/admin/AddVolunteer";
import { VolunteerTable } from "@/components/admin/VolunteerTable";
import { columns } from "@/components/admin/VolunteerColumn";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";

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

  interface vol {
    id: number;
    poc: pocForVol;
    user_id: user_id;
  }

  interface poc {
    id: number;
    user_id: user_id;
  }

  const { data, loading, error, refetch, abort } = useFetch<vol[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volbyPoc/1`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );

  const pocData = useFetch<poc>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/pocById/${params.slug}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );
  return (
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
          <div className=" text-sm">Volunteers</div>
        </div>
        <div className="flex w-full flex-row justify-end">
          <div className=" text-black">
            <AddVolunteer id={Number(params.slug)} />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {data && data.constructor === Array && (
          <div>
            <VolunteerTable columns={columns} data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
