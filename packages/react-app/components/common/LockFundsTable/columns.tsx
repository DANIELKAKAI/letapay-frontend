import { DataTableColumnHeader } from "../data-table-header";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentType } from "@/types/api-types";


export const LockFundsColumns: ColumnDef<PaymentType>[] = [
  {
    id: "select",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "payment_datetime",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Release Payment Datetime"
      />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
];