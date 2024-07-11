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
    accessorKey: "receiver_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Receiver Address" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount in cUsd" />
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
];