import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

// export type partnerColumn = {
//   id: string;
//   name: string;
// };

interface poc {
  id: number;
  name: string;
  email: string;
  role: string;
  closed: string;
}

const CellComponent = (row: CellContext<poc, unknown>) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // const router = useRouter();
  // const pushPage = (id: string) => {
  //   router.push(`/partners/${id}`);
  // };
  // const projectedData = row.getValue() as string;
  // return (
  //   <Button
  //     onClick={() => {
  //       pushPage(projectedData);
  //     }}
  //   >
  //     Details
  //   </Button>
  // );
  const mutation = useMutation({
    mutationKey: ["resendInvitePoc"],
    mutationFn: async (data: any) => {
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profileset`,
        data,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return resp.data;
    },
    onSettled: () => {
      //setOpen(false);
      // setSend(true);
      // setOrgName("");
      // setFromDate(undefined);
      // setToDate(undefined);
      // setRecipientPartnerCount(0);
      // setRecipientPartners.setState([]);
      toast({ title: "Partner invite has been resend" });
      queryClient.invalidateQueries({ queryKey: ["pocInviteList"] });
    },

    onError: (error) => {
      console.error("Error creating cohort:", error);
    },
  });
  if (row.row.original.closed != null) {
    return <div>Invite accepted</div>;
  } else {
    return (
      <Button
        variant="outline"
        onClick={() => {
          try {
            mutation.mutate({ destination: row.row.original.email });
          } catch (e) {
            console.error("Error creating cohort:", e);
          }
        }}
      >
        Resend
      </Button>
    );
  }
};

export const columns: ColumnDef<poc>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      align: "left",
    },
    cell: ({ getValue }) => {
      const projectedData = getValue() as string;
      return <div>{projectedData}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Details",
    meta: {
      align: "right",
    },
    cell: CellComponent,
  },
];
