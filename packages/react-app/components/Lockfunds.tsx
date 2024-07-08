import React, { useState} from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { letapayContractAddress, cUsdToWei, cUsdAddress } from "../utils/utils";
import LockFundsTableContainer from "./common/LockFundsTable/LockFunds";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
const LetapayABIJson = require("../../../../hardhat/artifacts/contracts/LetapayV2.sol/LetapayV2.json");
const ERC20ABIJson = require("../../../../hardhat/utils/erc20.abi.json");

function Lockfunds({ postPayment, payments, setPayments, userAddress }) {
  const [amountInput, setAmountInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });
  let walletClient = createWalletClient({
    transport: custom(window.ethereum),
    chain: celoAlfajores,
  });

  const handleAddClick = async () => {
    if (dateInput && timeInput && amountInput) {
      if (typeof window.ethereum !== "undefined") {
        const paymentId = await postPayment(
          userAddress,
          dateInput,
          timeInput,
          amountInput,
          "LOCKED"
        );

        const approveTx = await walletClient.writeContract({
          address: cUsdAddress,
          abi: ERC20ABIJson,
          functionName: "approve",
          account: userAddress,
          args: [letapayContractAddress, cUsdToWei(amountInput)],
        });

        let approveReceipt = await publicClient.waitForTransactionReceipt({
          hash: approveTx,
        });

        console.log(approveReceipt);

        const tx = await walletClient.writeContract({
          address: letapayContractAddress,
          abi: LetapayABIJson.abi,
          functionName: "addPayment",
          account: userAddress,
          args: [paymentId, userAddress, cUsdToWei(amountInput)],
        });

        let receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        console.log(receipt);

        alert(`${paymentId} added`);

        setDateInput("");
        setTimeInput("");
        setAmountInput("");

        setPayments([
          {
            receiver_address: userAddress,
            payment_datetime: `${dateInput}T${timeInput}`,
            amount: amountInput,
            status: "INPROGRESS",
          },
          ...payments,
        ]);
      } else {
        console.error("MetaMask is not installed");
      }
    }
  };

  return (
      <article>
        <Input
          type="number"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          placeholder="Enter amount"
          className="my-1"
        />
        <Input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="my-1"
        />
        <Input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="my-1"
        />

        <Button className="w-full my-1 bg-blue-500 hover:bg-blue-700" onClick={handleAddClick}>
          Lock
        </Button>
        {/* <div className="w-full">
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Release Date Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                if (payment.payment_type === "LOCKED") {
                  return (
                    <tr key={index}>
                      <td>{payment.amount}</td>
                      <td>{payment.payment_datetime}</td>
                      <td>{payment.status}</td>
                    </tr>
                  );
                }
                return null; // Ensure to return something (even null) if the condition isn't met
              })}
            </tbody>
          </table>
        </div> */}
        <LockFundsTableContainer />
      </article>
  );
}

export default Lockfunds;
