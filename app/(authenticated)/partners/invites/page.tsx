"use client";
import PartnerInviteListing from "@/components/admin/PartnerInviteListing";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <PartnerInviteListing />
    </div>
  );
}
