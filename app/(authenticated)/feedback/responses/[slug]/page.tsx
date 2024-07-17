"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/lib/useFetch";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [responseCount, setResponseCount] = useState(0);
  const [currentResponseId, setCurrentResponseId] = useState(0);
  const session = useSession();
  interface responseItem {
    id: number;
    feedbackitem_id: number;
    item_type: string;
    option_ans: string;
    descr_ans: string;
    question: string;
  }
  interface userResponse {
    id: number;
    form_id: number;
    vol_id: number;
    feedbackitemResponses: responseItem[];
  }
  const title = searchParams["title"];
  const { data, loading, error, refetch, abort } = useFetch<userResponse[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/getresponse/${params.slug}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );

  useEffect(() => {
    if (data) {
      setResponseCount(data?.length);
    }
  }, [data]);

  const incrementResponseId = () => {
    if (currentResponseId <= responseCount - 1) {
      setCurrentResponseId(currentResponseId + 1);
    }
  };

  const decrementResponseId = () => {
    if (currentResponseId > 0) {
      setCurrentResponseId(currentResponseId - 1);
    }
  };

  return (
    <div className="container mx-auto my-6 px-2 lg:px-8">
      <div className="flex flex-col lg:flex-row items-start justify-between mb-2 pt-4 pb-2 rounded bg-primary text-white px-4">
        <div className="flex flex-col ">
          <div className=" font-bold text-2xl">{title}</div>
          {data && data.constructor === Array && responseCount != 0 && (
            <div className="text-md">{data[currentResponseId]?.vol_id}</div>
          )}
        </div>
        <div className=" self-end flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={decrementResponseId}
            disabled={currentResponseId === 0}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={incrementResponseId}
            disabled={currentResponseId === responseCount - 1}
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {responseCount === 0 && (
          <div className="flex justify-center pt-4">No responses</div>
        )}
        {data && data.constructor === Array && responseCount != 0 && (
          <div>
            {data[currentResponseId].feedbackitemResponses.map(
              (value, index) => {
                return (
                  <div key={index} className=" px-2">
                    <div className=" font-semibold">
                      {index + 1}. {value.question}
                    </div>
                    {value.item_type === "descriptive" && (
                      <div>
                        <div>{value.descr_ans}</div>
                      </div>
                    )}
                    {value.item_type === "multiplechoice" && (
                      <div>
                        <div>{value.option_ans}</div>
                      </div>
                    )}
                    {index !=
                      data[currentResponseId].feedbackitemResponses.length -
                        1 && (
                      <div className=" py-1">
                        <Separator />
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
