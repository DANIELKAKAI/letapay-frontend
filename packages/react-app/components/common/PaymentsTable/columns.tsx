import { DataTableColumnHeader } from "../data-table-header";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentType } from "@/types/api-types";


export const PaymentColumns: ColumnDef<PaymentType>[] = [
  {
    id: "select",
  },
  {
    accessorKey: "payment_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment ID" />
    ),
  },
  {
    accessorKey: "sender_address",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sender Address"
      />
    ),
  },
  {
    accessorKey: "receiver_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Receiver Address" />
    ),
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
        title="Payment Datetime"
      />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "payment_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Type" />
    ),
  },
];