"use client";
import PartnerListing from "@/components/admin/PartnerListing";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <PartnerListing />
    </div>
  );
}
