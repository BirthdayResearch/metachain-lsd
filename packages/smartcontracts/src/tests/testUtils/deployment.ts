import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import { ShareToken, MarbleLsdV1, MarbleLsdV1__factory } from '../../generated';

export async function deployContracts(): Promise<MarbleLsdDeploymentResult> {
  const accounts = await ethers.getSigners();
  const defaultAdminSigner = await ethers.getSigner(accounts[0].address);
  const walletSigner = await ethers.getSigner(accounts[1].address);
  const MarbleLsdUpgradeable = await ethers.getContractFactory('MarbleLsdV1');
  const marbleLsdUpgradeable = await MarbleLsdUpgradeable.deploy();
  await marbleLsdUpgradeable.waitForDeployment();
  const marbleLsdUpgradeableAddress = await marbleLsdUpgradeable.getAddress()
  const MarbleLsdProxy = await ethers.getContractFactory('MarbleLsdProxy');
  const administratorSigner = accounts[2]
  const rewardDistributerAndFinalizeSigner = accounts[3]
  // deployment arguments for the Proxy contract
  const encodedData = MarbleLsdV1__factory.createInterface().encodeFunctionData('initialize', [
    // default admin address
    accounts[0].address,
    // default administrator address
    administratorSigner.address,
    // default reward distributer address
    rewardDistributerAndFinalizeSigner.address,
    // default finalizer distributer address
    rewardDistributerAndFinalizeSigner.address,
    // default wallet address
    accounts[1].address,
  ]);

  const marbleLsdProxy = await MarbleLsdProxy.deploy(marbleLsdUpgradeableAddress, encodedData);
  await marbleLsdProxy.waitForDeployment();
  const marbleLsdProxyAddress = await marbleLsdProxy.getAddress()
  const proxyMarbleLsd = MarbleLsdUpgradeable.attach(marbleLsdProxyAddress) as MarbleLsdV1;
  
  const shareTokenAddress = await proxyMarbleLsd.shareToken()
  const shareTokenFactory = await ethers.getContractFactory('ShareToken');
  const shareToken = shareTokenFactory.attach(shareTokenAddress) as ShareToken

  // // set REWARDS_DISTRIBUTER_ROLE      
  // const rewardsDistributionHash = await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
  // await proxyMarbleLsd.grantRole(rewardsDistributionHash, rewardDistributerAndFinalizeSigner.address);
  // // set FINALIZE_ROLE      
  // const finalizeRoleHash = await proxyMarbleLsd.FINALIZE_ROLE();
  // await proxyMarbleLsd.grantRole(finalizeRoleHash, rewardDistributerAndFinalizeSigner.address);
  
  return {
    proxyMarbleLsd,
    marbleLsdImplementation: marbleLsdUpgradeable,
    defaultAdminSigner,
    rewardDistributerAndFinalizeSigner,
    administratorSigner,
    walletSigner,
    shareToken
  };
}

export interface MarbleLsdDeploymentResult {
  proxyMarbleLsd: MarbleLsdV1;
  marbleLsdImplementation: MarbleLsdV1;
  defaultAdminSigner: SignerWithAddress;
  rewardDistributerAndFinalizeSigner: SignerWithAddress;
  administratorSigner: SignerWithAddress;
  walletSigner: SignerWithAddress;
  shareToken: ShareToken;
}
