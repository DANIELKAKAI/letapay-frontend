"use client";

import React from "react";
import { PaymentType } from "@/types/api-types";
import LockFundsTable from ".";
import { LockFundsColumns } from "./columns";

const LockFundsTableContainer = ({payments}) => {
  const generateTblData = (item: PaymentType): PaymentType => {
    return {
      payment_id: item.payment_id,
      sender_address: item.sender_address,
      receiver_address: item.receiver_address,
      amount: item.amount,
      payment_datetime: item.payment_datetime,
      status: item.status,
      payment_type: item.payment_type
    };
  };
  
  const tableData = payments.map((element) => generateTblData(element))
  .filter((item) => item.payment_type === "LOCKED");
  return <LockFundsTable columns={LockFundsColumns} data={tableData} />;
};

export default LockFundsTableContainer;
