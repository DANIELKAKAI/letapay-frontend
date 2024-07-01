import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Payments from "@/components/Payments";
import Lockfunds from "@/components/Lockfunds";

const url = "https://a0d2-102-217-172-2.ngrok-free.app";

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

      const response = await fetch(
        `${url}/payments`,
        requestOptions
      );
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
            "Accept": "application/json",
          },
        redirect: "follow",
      };

      fetch(
        `${url}/payments?sender_address=${senderAddress}`,
        requestOptions
      )
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
          <div>
            <Payments postPayment={postPayment} payments={payments} setPayments={setPayments} userAddress={userAddress} />
            <Lockfunds postPayment={postPayment} payments={payments} setPayments={setPayments} userAddress={userAddress} />
          </div>
        </>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
