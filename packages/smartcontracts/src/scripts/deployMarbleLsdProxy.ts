import { ethers } from "hardhat";

import {
  MarbleLsdProxy,
  MarbleLsdV1,
  MarbleLsdV1__factory,
} from "../generated";
import { verify } from "./utils/verify";

export async function deployMarbleLsdProxy({
  adminAddress,
  administratorAddress,
  walletAddress,
  feesRecipientAddress,
  rewardDistributerAddress,
  finalizerAddress,
  marbleLsdV1Address,
}: InputsForInitialization): Promise<MarbleLsdProxy> {
  const contract = await ethers.getContractFactory("MarbleLsdProxy");

  const encodedData = MarbleLsdV1__factory.createInterface().encodeFunctionData(
    "initialize",
    [
      // admin address, or timelock contract address
      adminAddress,
      // administrator distributer address,
      administratorAddress,
      // reward distributer address,
      rewardDistributerAddress,
      // finalizer address
      finalizerAddress,
      // withdraw address
      walletAddress,
      // fees recipient address
      feesRecipientAddress,
    ]
  );
  const marbleLsdProxy = await contract.deploy(marbleLsdV1Address, encodedData);
  await marbleLsdProxy.waitForDeployment();
  const marbleLsdProxyAddress = await marbleLsdProxy.getAddress();
  const txn = await marbleLsdProxy.deploymentTransaction();
  await txn?.wait(10);
  console.log("Proxy Address: ", marbleLsdProxyAddress);
  console.log("Verifying...");
  await verify({
    contractAddress: marbleLsdProxyAddress,
    args: [marbleLsdV1Address, encodedData],
    contract: "contracts/MarbleLsdProxy.sol:MarbleLsdProxy",
  });
  // verify receipt token
  const MarbleLsdUpgradeable = await ethers.getContractFactory("MarbleLsdV1");
  const proxyMarbleLsd = MarbleLsdUpgradeable.attach(
    marbleLsdProxyAddress
  ) as MarbleLsdV1;

  const receiptToken = await proxyMarbleLsd.shareToken();
  console.log("Share Token Address: ", receiptToken);
  console.log("Verifying...");
  await verify({
    contractAddress: receiptToken,
    args: ["DFI STAKING SHARE TOKEN", "mDFI"],
  });
  return marbleLsdProxy;
}

interface InputsForInitialization {
  adminAddress: string;
  administratorAddress: string;
  walletAddress: string;
  feesRecipientAddress: string;
  marbleLsdV1Address: string;
  rewardDistributerAddress: string;
  finalizerAddress: string;
}
