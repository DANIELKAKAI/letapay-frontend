import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Payments from "@/components/Payments";
import Lockfunds from "@/components/Lockfunds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const url = "http://192.168.100.6:8000";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [payments, setPayments] = useState([]);
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

  useEffect(() => {
  }, [payments]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      {userAddress ? (
        <div className="">
          <Tabs defaultValue="payments" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Schedule Payments</TabsTrigger>
              <TabsTrigger value="lockfunds">Lock Funds</TabsTrigger>
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
        </div>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
