import React, { useState, useEffect } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";
import { letapayContractAddress, cUsdToWei, cUsdAddress } from "../utils/utils";
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
    <div className="App">
      <header className="App-header">
        <div>
          <input
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>
        <div>
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={handleAddClick}>
          Lock
        </button>
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
      </header>
    </div>
  );
}

export default Lockfunds;
