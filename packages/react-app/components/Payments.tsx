import React, { useState, useEffect } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";
import { letapayContractAddress, cUsdToWei, cUsdAddress } from "../utils/utils";
const LetapayABIJson = require("../../../../hardhat/artifacts/contracts/LetapayV2.sol/LetapayV2.json");
const ERC20ABIJson = require("../../../../hardhat/utils/erc20.abi.json");

function Payments() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  const [recieverAddressInput, setRecieverAddressInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

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
        let paymentId = uuidv4();

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

        setEntries([
          ...entries,
          {
            recieverAddressInput: recieverAddressInput,
            date: dateInput,
            time: timeInput,
            amount: amountInput,
            status: "INPROGRESS",
          },
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
              <th>Address</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.recieverAddressInput}</td>
                <td>{entry.amount}</td>
                <td>{entry.date}</td>
                <td>{entry.time}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default Payments;
