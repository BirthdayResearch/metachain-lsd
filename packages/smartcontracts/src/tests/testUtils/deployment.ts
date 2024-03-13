import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

import { MarbleLsdV1, MarbleLsdV1__factory, ShareToken } from "../../generated";

export async function deployContracts(): Promise<MarbleLsdDeploymentResult> {
  const accounts = await ethers.getSigners();
  const defaultAdminSigner = await ethers.getSigner(accounts[0].address);
  const walletSigner = await ethers.getSigner(accounts[1].address);
  const MarbleLsdUpgradeable = await ethers.getContractFactory("MarbleLsdV1");
  const marbleLsdUpgradeable = await MarbleLsdUpgradeable.deploy();
  await marbleLsdUpgradeable.waitForDeployment();
  const marbleLsdUpgradeableAddress = await marbleLsdUpgradeable.getAddress();
  const MarbleLsdProxy = await ethers.getContractFactory("MarbleLsdProxy");
  // deployment arguments for the Proxy contract
  const encodedData = MarbleLsdV1__factory.createInterface().encodeFunctionData(
    "initialize",
    [
      // default admin address
      accounts[0].address,
      // default wallet address
      accounts[1].address,
      // receipt token name
      "DFI STAKING RECEIPT TOKEN",
      // receipt token symbol
      "xDFI",
    ],
  );

  const marbleLsdProxy = await MarbleLsdProxy.deploy(
    marbleLsdUpgradeableAddress,
    encodedData,
  );
  await marbleLsdProxy.waitForDeployment();
  const marbleLsdProxyAddress = await marbleLsdProxy.getAddress();
  const proxyMarbleLsd = MarbleLsdUpgradeable.attach(
    marbleLsdProxyAddress,
  ) as MarbleLsdV1;

  const shareTokenAddress = await proxyMarbleLsd.shareToken();
  const shareTokenFactory = await ethers.getContractFactory("ShareToken");
  const shareToken = shareTokenFactory.attach(shareTokenAddress) as ShareToken;

  const rewardDistributerSigner = accounts[3];
  // set REWARDS_DISTRIBUTER_ROLE
  const hash = await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
  await proxyMarbleLsd.grantRole(hash, rewardDistributerSigner.address);

  return {
    proxyMarbleLsd,
    marbleLsdImplementation: marbleLsdUpgradeable,
    defaultAdminSigner,
    rewardDistributerSigner,
    walletSigner,
    shareToken,
  };
}

export interface MarbleLsdDeploymentResult {
  proxyMarbleLsd: MarbleLsdV1;
  marbleLsdImplementation: MarbleLsdV1;
  defaultAdminSigner: SignerWithAddress;
  rewardDistributerSigner: SignerWithAddress;
  walletSigner: SignerWithAddress;
  shareToken: ShareToken;
}
