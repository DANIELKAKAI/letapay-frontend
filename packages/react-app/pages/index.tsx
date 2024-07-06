import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Payments from "@/components/Payments";
import Lockfunds from "@/components/Lockfunds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const url = "https://a0d2-102-217-172-2.ngrok-free.app";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [payments, setPayments] = useState([
    {
      payment_id: "afd27c8f-e700-4679-93df-511f3a2c0fd4",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.1,
      payment_datetime: "2024-07-02T16:55:00+03:00",
      status: "INPROGRESS",
      payment_type: "LOCKED",
    },
    {
      payment_id: "c2c97c8d-3799-4084-b1d0-0a39f38f4a8c",
      sender_address: "0x4A8E770a33631Bb909c424CaA8C48BbC28Be96b1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 1.0,
      payment_datetime: "2024-07-01T20:30:00+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "d1584323-0efd-4f0e-9ad0-972236992a7b",
      sender_address: "0xB48Cde7DeEBB6E0415f7aD7f386cC0ec787dadF3",
      receiver_address: "0x5787129004C2fAfA9Dace8f859e6dD03402aC612",
      amount: 0.5,
      payment_datetime: "2024-07-01T19:56:00+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "4d9f617b-aada-4099-94d1-4b8817e3f88c",
      sender_address: "0xB48Cde7DeEBB6E0415f7aD7f386cC0ec787dadF3",
      receiver_address: "0xB48Cde7DeEBB6E0415f7aD7f386cC0ec787dadF3",
      amount: 0.5,
      payment_datetime: "2024-07-01T19:47:00+03:00",
      status: "COMPLETE",
      payment_type: "LOCKED",
    },
    {
      payment_id: "562beb60-d1b3-4510-8ab1-10b2fdd32c25",
      sender_address: "0xB48Cde7DeEBB6E0415f7aD7f386cC0ec787dadF3",
      receiver_address: "0xB48Cde7DeEBB6E0415f7aD7f386cC0ec787dadF3",
      amount: 0.1,
      payment_datetime: "2024-07-01T19:42:00+03:00",
      status: "COMPLETE",
      payment_type: "LOCKED",
    },
    {
      payment_id: "1df656a7-6f9d-4384-b49d-720ac99c095b",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      amount: 0.08,
      payment_datetime: "2024-07-01T19:15:00+03:00",
      status: "COMPLETE",
      payment_type: "LOCKED",
    },
    {
      payment_id: "acdf7bdc-17ce-48e2-bc21-3c8bae5bbc3c",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      amount: 0.09,
      payment_datetime: "2024-07-01T19:08:00+03:00",
      status: "COMPLETE",
      payment_type: "LOCKED",
    },
    {
      payment_id: "7c2669ab-26fb-4749-8d4a-c761075ce690",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.2,
      payment_datetime: "2024-07-01T17:15:00+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "efac219c-e138-4ea9-9251-6212b44cebf2",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.1,
      payment_datetime: "2024-07-01T17:05:00+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "53c2cfda-de48-4909-9078-36837eb642c3",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.7,
      payment_datetime: "2024-07-01T16:05:03+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "98890115-1178-4bf7-8014-5bdbf2b2225f",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.7,
      payment_datetime: "2024-07-01T16:00:03+03:00",
      status: "INPROGRESS",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "00c15c28-c586-4b3e-920d-a9f36d6001a3",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.6,
      payment_datetime: "2024-06-30T16:10:03+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "a86e719f-c8b9-4ab2-8cc5-9bb901bcd153",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.6,
      payment_datetime: "2024-06-30T16:07:03+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "d43d3613-e167-47ad-93a7-2f037bb1067b",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.6,
      payment_datetime: "2024-06-30T16:04:03+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "a88dee1b-a7e7-4b74-b52f-35dc1f387b56",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.6,
      payment_datetime: "2024-06-30T15:51:03+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
    {
      payment_id: "f1af4424-1317-42b1-b7ff-69addd185ce8",
      sender_address: "0x141adc0e0158B4c6886534701412da2E2b0d7fF1",
      receiver_address: "0x31B2821B611b8e07d88c9AFcb494de8E36b09537",
      amount: 0.6,
      payment_datetime: "2023-06-30T18:49:00+03:00",
      status: "COMPLETE",
      payment_type: "SCHEDULED",
    },
  ]);
  const { address, isConnected } = useAccount();

  const postPayment = async (
    receiverAddressInput,
    dateInput,
    timeInput,
    amountInput,
    paymentType = "SCHEDULED"
  ) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        sender_address: userAddress,
        receiver_address: receiverAddressInput,
        amount: amountInput,
        payment_datetime: `${dateInput}T${timeInput}:00+03:00`,
        status: "INPROGRESS",
        payment_type: paymentType,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(`${url}/payments`, requestOptions);
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        return result.payment_id;
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getPayments = async (senderAddress) => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        redirect: "follow",
      };

      fetch(`${url}/payments?sender_address=${senderAddress}`, requestOptions)
        .then((response) => response.json())
        .then((result) => setPayments(result))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (isConnected && address) {
      setUserAddress(address);
      getPayments(address);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {userAddress ? (
        <>
          <div className="h1 text-center">Your address: {userAddress}</div>
          <Tabs defaultValue="payments" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="lockfunds">Lockfunds</TabsTrigger>
            </TabsList>
            <TabsContent value="payments">
              <Payments
                postPayment={postPayment}
                payments={payments}
                setPayments={setPayments}
                userAddress={userAddress}
              />
            </TabsContent>
            <TabsContent value="lockfunds">
              <Lockfunds
                postPayment={postPayment}
                payments={payments}
                setPayments={setPayments}
                userAddress={userAddress}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
