"use client";
import CohortListing from "@/components/admin/CohortListing";
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <CohortListing />
    </div>
  );
}
