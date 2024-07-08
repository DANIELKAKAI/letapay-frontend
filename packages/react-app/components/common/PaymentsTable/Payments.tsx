"use client";

import React from "react";
import { PaymentColumns } from "./columns";
import PaymentTable from ".";
import { PaymentType } from "@/types/api-types";

const PaymentTableContainer = ({payments}) => {
  const generateTblData = (item: PaymentType): PaymentType => {
    return {
      payment_id: item.payment_id,
      receiver_address: item.receiver_address,
      amount: item.amount,
      payment_datetime: item.payment_datetime,
      status: item.status,
      payment_type: item.payment_type
    };
  };

  const tableData = payments.map((element) => generateTblData(element)).filter((item) => item.payment_type === "SCHEDULED");
  
  return <PaymentTable columns={PaymentColumns} data={tableData} />;
};

export default PaymentTableContainer;
