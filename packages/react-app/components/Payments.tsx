import React, { useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { letapayContractAddress, cUsdToWei, cUsdAddress } from "../utils/utils";
const LetapayABIJson = require("../../../../hardhat/artifacts/contracts/LetapayV2.sol/LetapayV2.json");
const ERC20ABIJson = require("../../../../hardhat/utils/erc20.abi.json");

function Payments({ postPayment, payments, setPayments, userAddress }) {
  const [recieverAddressInput, setRecieverAddressInput] = useState("");
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
    if (recieverAddressInput && dateInput && timeInput && amountInput) {
      if (typeof window.ethereum !== "undefined") {
        const paymentId = await postPayment(
          recieverAddressInput,
          dateInput,
          timeInput,
          amountInput
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
          args: [paymentId, recieverAddressInput, cUsdToWei(amountInput)],
        });

        let receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        console.log(receipt);

        alert(`${paymentId} added`);

        setRecieverAddressInput("");
        setDateInput("");
        setTimeInput("");
        setAmountInput("");

        setPayments([
          {
            receiver_address: recieverAddressInput,
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
        <h1>Letapay</h1>
        <div>
          <input
            type="text"
            value={recieverAddressInput}
            onChange={(e) => setRecieverAddressInput(e.target.value)}
            placeholder="Enter address"
          />
        </div>
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
          Add
        </button>
        <table>
          <thead>
            <tr>
              <th>Reciever Address</th>
              <th>Amount</th>
              <th>Payment Date Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              if (payment.payment_type === "SCHEDULED") {
                return (
                  <tr key={index}>
                    <td>{payment.receiver_address}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.payment_datetime}</td>
                    <td>{payment.status}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default Payments;
