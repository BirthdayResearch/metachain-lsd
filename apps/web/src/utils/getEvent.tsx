import { ethers } from "ethers";
import { TESTNET_CONFIG } from "@/config";

export async function getEvent() {
  const { EthereumRpcUrl, LSDV1 } = TESTNET_CONFIG;

  const provider = new ethers.providers.WebSocketProvider(EthereumRpcUrl);

  // Connect to the contract
  const contract = new ethers.Contract(LSDV1.address, LSDV1.abi, provider);

  console.log(contract);
  // Subscribe to the STAKE event
  contract.on("STAKE", (from, amount, stakedAt, event) => {
    console.log("STAKE event received:");
    console.log("From:", from);
    console.log("Amount:", amount.toString());
    console.log("Staked At:", stakedAt.toString());
    console.log("Event:", event);
  });
  return <></>;
}
