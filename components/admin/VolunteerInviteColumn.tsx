import { ColumnDef, CellContext } from "@tanstack/react-table";
import { VolunteerDetails } from "@/components/admin/VolunteerDetails";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import LogHistory from "@/components/admin/LogHistory";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export type volunteerColumn = {
  id: string;
  name: string;
};

interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface poc {
  id: number;
}

// interface vol {
//   id: number;
//   poc: poc;
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

// const CellComponent = (row: CellContext<vol, unknown>) => {
//   const projectedData = row.getValue() as string;
//   const [open, setOpen] = useState(false);

//   // TODO: Set the accepted/(nil&date older => re invite) as per backend reply
//   return (
//     <div className="flex flex-row-reverse gap-2">
//       <VolunteerDetails volId={Number(projectedData)} />
//       <Drawer open={open} onOpenChange={setOpen}>
//         <DrawerTrigger asChild>
//           <Button variant="outline">
//             <LicenseIcon />
//           </Button>
//         </DrawerTrigger>
//         <DrawerContent>
//           <DrawerHeader className="text-left">
//             <DrawerTitle className="text-2xl">View Logs</DrawerTitle>
//           </DrawerHeader>
//           <DrawerDescription className="px-4">
//             Select date to view the log
//           </DrawerDescription>
//           <LogHistory selected_id={row.row.original.id} />
//           <DrawerFooter className="pt-2">
//             <DrawerClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DrawerClose>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </div>
//   );
// };
const CellComponent = (row: CellContext<vol, unknown>) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationKey: ["resendInviteVol"],
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
      toast({ title: "Volunteer invite has been resend" });
      queryClient.invalidateQueries({ queryKey: ["volInviteList"] });
    },

    onError: (error) => {
      console.error("Error inviting volunteer:", error);
    },
  });
  // const projectedData = row.getValue() as string;
  // const [open, setOpen] = useState(false);

  // TODO: Set the accepted/(nil&date older => re invite) as per backend reply
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
  // return (
  //   <div className="flex flex-row-reverse gap-2">
  //     <VolunteerDetails volId={Number(projectedData)} />
  //     <Drawer open={open} onOpenChange={setOpen}>
  //       <DrawerTrigger asChild>
  //         <Button variant="outline">
  //           <LicenseIcon />
  //         </Button>
  //       </DrawerTrigger>
  //       <DrawerContent>
  //         <DrawerHeader className="text-left">
  //           <DrawerTitle className="text-2xl">View Logs</DrawerTitle>
  //         </DrawerHeader>
  //         <DrawerDescription className="px-4">
  //           Select date to view the log
  //         </DrawerDescription>
  //         <LogHistory selected_id={row.row.original.id} />
  //         <DrawerFooter className="pt-2">
  //           <DrawerClose asChild>
  //             <Button variant="outline">Cancel</Button>
  //           </DrawerClose>
  //         </DrawerFooter>
  //       </DrawerContent>
  //     </Drawer>
  //   </div>
  //   );
  // };
};

export const columns: ColumnDef<vol>[] = [
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

const LicenseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M12.5294 2C16.5225 2 18.519 2 19.7595 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.7595 20.8284C18.519 22 16.5225 22 12.5294 22H11.4706C7.47751 22 5.48098 22 4.24049 20.8284C3 19.6569 3 17.7712 3 14L3 10C3 6.22876 3 4.34315 4.24049 3.17157C5.48098 2 7.47752 2 11.4706 2L12.5294 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 7H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 12H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 17H12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
