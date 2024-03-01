import { ethers } from 'hardhat';

import { MarbleLsdProxy, MarbleLsdV1, MarbleLsdV1__factory } from '../generated';
import { verify } from './utils/verify';

export async function deployMarbleLsdProxy({
  adminAddress,
  walletAddress,
  marbleLsdV1Address
}: InputsForInitialization): Promise<MarbleLsdProxy> {
  const contract = await ethers.getContractFactory('MarbleLsdProxy');
  const receiptTokenName = 'DFI STAKING SHARE TOKEN'
  const receiptTokenSymbol = 'xDFI'
  const encodedData = MarbleLsdV1__factory.createInterface().encodeFunctionData('initialize', [
    // admin address, or timelock contract address
    adminAddress,
    // withdraw address
    walletAddress,
    // receipt token name
    receiptTokenName,
    // receipt token symbol
    receiptTokenSymbol
  ]);
  const marbleLsdProxy = await contract.deploy(marbleLsdV1Address, encodedData);
  await marbleLsdProxy.waitForDeployment();
  const marbleLsdProxyAddress = await marbleLsdProxy.getAddress()
  const txn = await marbleLsdProxy.deploymentTransaction()
  await txn?.wait(10);
  console.log('Proxy Address: ', marbleLsdProxyAddress);
  console.log('Verifying...');
  await verify({
    contractAddress: marbleLsdProxyAddress, 
    args: [marbleLsdV1Address, encodedData], 
    contract: "contracts/MarbleLsdProxy.sol:MarbleLsdProxy" 
  });
  // verify receipt token 
  const MarbleLsdUpgradeable = await ethers.getContractFactory('MarbleLsdV1');
  const proxyMarbleLsd = MarbleLsdUpgradeable.attach(marbleLsdProxyAddress) as MarbleLsdV1;

  const receiptToken = await proxyMarbleLsd.shareToken()
  console.log('Share Token Address: ', receiptToken);
  console.log('Verifying...');
  await verify({ 
    contractAddress: receiptToken, 
    args: [receiptTokenName, receiptTokenSymbol], 
  });
  return marbleLsdProxy;
}

interface InputsForInitialization {
  adminAddress: string;
  walletAddress: string;
  marbleLsdV1Address: string;
}
