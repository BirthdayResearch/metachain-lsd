import { ConfigService } from "@nestjs/config";
import { WIF, Elliptic } from "@defichain/jellyfish-crypto";
import { WalletClassic } from "@defichain/jellyfish-wallet-classic";
import {
  EnvironmentNetwork,
  getJellyfishNetwork,
} from "@waveshq/walletkit-core";
import { MarbleLsdV1__factory } from "smartcontracts/dist";
import { Injectable } from "@nestjs/common";
import { WhaleWalletAccount } from "@defichain/whale-api-wallet";
import { WhaleApiClient } from "@defichain/whale-api-client";
import { WhaleApiClientProvider } from "./WhaleApiClientProvider";
import { AddressToken } from "@defichain/whale-api-client/dist/api/address";
import BigNumber from "bignumber.js";
import { Prevout } from "@defichain/jellyfish-transaction-builder";
import TransferDomainV1 from "../abi/TransferDomainV1";
import { Eth } from "@defichain/jellyfish-address";
import {
  Wallet,
  JsonRpcProvider,
  Interface,
  parseUnits,
  TransactionRequest,
  TransactionResponse,
  formatEther,
  Contract,
} from "ethers";
import {
  CTransactionSegWit,
  TransactionSegWit,
  TransferDomain,
  Script,
} from "@defichain/jellyfish-transaction";
import { UtxosToAccount } from "@defichain/jellyfish-transaction";

export const TD_CONTRACT_ADDR = "0xdf00000000000000000000000000000000000001";
enum TRANSFER_DOMAIN_TYPE {
  DVM = 2,
  EVM = 3,
}

@Injectable()
export class WalletProvider {
  private ethRPCUrl: string;
  private account: WhaleWalletAccount;
  private client: WhaleApiClient;
  private wallet: WalletClassic;
  private evmProvider: JsonRpcProvider;
  private evmWallet: Wallet;
  private marbleFiContractAddress: string;

  constructor(
    private readonly privateKey: string,
    private readonly network: EnvironmentNetwork,
    private readonly whaleClient: WhaleApiClientProvider,
    private readonly configService: ConfigService,
  ) {
    this.ethRPCUrl = this.configService.getOrThrow<EnvironmentNetwork>(
      `defichain.${this.network}.ethRPCUrl`,
    );
    this.marbleFiContractAddress =
      this.configService.getOrThrow<EnvironmentNetwork>(
        `defichain.${this.network}.marbleFiContractAddress`,
      );
  }

  getWallet(): WalletClassic {
    const curvePair =
      this.privateKey?.length === 54
        ? WIF.asEllipticPair(this.privateKey)
        : Elliptic.fromPrivKey(Buffer.from(this.privateKey, "hex"));

    return new WalletClassic(curvePair);
  }

  public async initWallet() {
    const network = getJellyfishNetwork(this.network);

    this.wallet = this.getWallet();
    this.client = this.whaleClient.getClient(this.network);
    this.account = new WhaleWalletAccount(this.client, this.wallet, network);
    this.evmProvider = new JsonRpcProvider(this.ethRPCUrl);

    const key = (await this.account.privateKey()).toString("hex");
    this.evmWallet = new Wallet(key, this.evmProvider);
  }

  async getUTXOBalance(): Promise<string> {
    const address = await this.account.getAddress();
    return this.client.address.getBalance(address);
  }

  async getEvmBalance(): Promise<string> {
    const address = await this.account.getEvmAddress();
    const balance = await this.evmProvider.getBalance(address);
    return formatEther(balance.toString());
  }

  async getAddress(): Promise<{ address: string; evmAddress: string }> {
    const address = await this.account.getAddress();
    const evmAddress = await this.account.getEvmAddress();
    return {
      address,
      evmAddress,
    };
  }

  /**
   * Get token balance from wallet with minBalance
   */
  async getTokenBalance(
    symbol: string,
    minBalance: BigNumber,
  ): Promise<AddressToken | undefined> {
    const address = await this.account.getAddress();
    const tokens = await this.client.address.listToken(address, 200);

    return tokens.find((token) => {
      return (
        token.isDAT &&
        token.symbol === symbol &&
        new BigNumber(token.amount).gte(minBalance)
      );
    });
  }

  private async getTransferDomainVin(
    account: WhaleWalletAccount,
  ): Promise<{ utxos: Prevout[]; walletOwnerDvmScript: Script }> {
    const walletOwnerDvmAddress = await account.getAddress();
    const walletOwnerDvmScript = await account.getScript();

    const utxoList = await account.client.address.listTransactionUnspent(
      walletOwnerDvmAddress,
    );
    const utxos: Prevout[] = [];

    if (utxoList.length > 0) {
      utxos.push({
        txid: utxoList[0].vout.txid,
        vout: utxoList[0].vout.n,
        value: new BigNumber(utxoList[0].vout.value),
        script: walletOwnerDvmScript,
        tokenId: utxoList[0].vout.tokenId ?? 0,
      });
    }

    return { utxos, walletOwnerDvmScript };
  }

  private async createSignedEvmTx({
    amount,
    dvmAddress,
    evmAddress,
    chainId,
    nonce,
  }: {
    amount: BigNumber;
    dvmAddress: string;
    evmAddress: string;
    privateKey: string;
    chainId?: number;
    nonce: number;
  }): Promise<Uint8Array> {
    const tdFace = new Interface(TransferDomainV1.abi);
    const contractAddress = TD_CONTRACT_ADDR;
    const to = evmAddress;
    const parsedAmount = parseUnits(
      amount.decimalPlaces(8, BigNumber.ROUND_DOWN).toFixed(),
      18,
    );

    /* For DFI, use `transfer` function */
    const transferDfi = [contractAddress, to, parsedAmount, dvmAddress];
    const data = tdFace.encodeFunctionData("transfer", transferDfi);

    const tx: TransactionRequest = {
      to: contractAddress,
      nonce,
      chainId,
      data,
      value: 0,
      gasLimit: 0,
      gasPrice: 0,
      type: 0,
    };
    const evmtxSigned = (await this.evmWallet.signTransaction(tx)).substring(2); // rm prefix `0x`

    return new Uint8Array(Buffer.from(evmtxSigned, "hex"));
  }

  /**
   *  Convert DFI from DVM to EVM
   */
  async convertDFIToEVM(
    amountToTransfer: BigNumber,
    evmAddress: string,
  ): Promise<boolean> {
    console.log(
      `Converting ${amountToTransfer.toFixed(8)} DFI from DVM to EVM address: ${evmAddress}`,
    );
    const dvmAddress = await this.account.getAddress();
    const dvmScript = await this.account.getScript();

    const evmScript = Eth.fromAddress(evmAddress)!;

    // Instantiate ethers RPC
    const { chainId } = await this.evmProvider.getNetwork();
    const nonce = await this.evmProvider.getTransactionCount(
      this.account.getEvmAddress(),
    );

    const { utxos, walletOwnerDvmScript } = await this.getTransferDomainVin(
      this.account,
    );
    const signedEvmTxData = await this.createSignedEvmTx({
      amount: amountToTransfer,
      dvmAddress,
      evmAddress,
      privateKey: (await this.account.privateKey()).toString("hex"),
      chainId: Number(chainId),
      nonce,
    });

    const transferDomain: TransferDomain = {
      items: [
        {
          src: {
            address: dvmScript,
            domain: TRANSFER_DOMAIN_TYPE.DVM,
            amount: {
              token: 0,
              amount: amountToTransfer,
            },
            data: new Uint8Array([]),
          },
          dst: {
            address: evmScript,
            domain: TRANSFER_DOMAIN_TYPE.EVM,
            amount: {
              token: 0,
              amount: amountToTransfer,
            },
            data: signedEvmTxData,
          },
        },
      ],
    };

    const txn = await this.account
      .withTransactionBuilder()
      .account.transferDomain(transferDomain, walletOwnerDvmScript, utxos);

    await this.sendAndWait(txn, "Transfer");
    return true;
  }

  // value in fi
  async sendEvmRewards(value: bigint): Promise<TransactionResponse> {
    try {
      console.log("Initializing send Evm rewards", value);
      const txn = await this.evmWallet.sendTransaction({
        to: this.marbleFiContractAddress,
        value,
      });

      console.log("Sending Evm Rewards Txn hash ", txn.hash);

      // Waiting 5 confirmations. You can put any number of confirmations here
      const txReceipt = await txn.wait(5);
      console.log("Sending Evm rewards: ", txReceipt.hash);

      return txn;
    } catch (err) {
      console.error(`Error occurred while sending rewards: ${err.message}`);
    }
  }

  // value in fi
  async finalizeWithdrawalRequest(
    lastRequestIdToBeFinalized: string,
    value: bigint,
  ): Promise<TransactionResponse> {
    try {
      console.log("Initializing send finalize withdrawal", value);
      const marbleFiContract = new Contract(
        this.marbleFiContractAddress,
        MarbleLsdV1__factory.abi,
        this.evmProvider,
      );
      const preData = await marbleFiContract.prefinalize([
        lastRequestIdToBeFinalized,
      ]);
      const tdFace = new Interface(MarbleLsdV1__factory.abi);
      const data = tdFace.encodeFunctionData("finalize", [1]);

      // Creating and sending the transaction object
      const from = this.account.getEvmAddress();
      const nonce = await this.evmProvider.getTransactionCount(from);
      const txn = await this.evmWallet.sendTransaction({
        to: this.marbleFiContractAddress,
        from,
        value: preData[0],
        data,
        nonce,
      });

      console.log("Finalize withdrawal Txn hash ", txn.hash);

      // Waiting 5 confirmations. You can put any number of confirmations here
      const txReceipt = await txn.wait(5);
      console.log("Finalize withdrawal receipt: ", txReceipt.hash);

      return txn;
    } catch (err) {
      console.error(`Error occurred while finalize withdrawal: ${err.message}`);
    }
  }

  private async sendAndWait(
    tx: TransactionSegWit,
    debugInfo?: string,
  ): Promise<boolean> {
    const ctx = await this.sendTx(tx, debugInfo);
    return await this.waitForTx(ctx);
  }

  private async sendTx(
    txn: TransactionSegWit,
    debugInfo?: string,
  ): Promise<string> {
    const hex: string = new CTransactionSegWit(txn).toHex();
    const txId: string = await this.client.rawtx.send({ hex });
    console.log(`${debugInfo != null ? debugInfo + " " : ""}TxId: ${txId}`);
    return txId;
  }

  private async waitForTx(txId: string): Promise<boolean> {
    const waitingMinutes = 10;
    const initialTime = 15000;
    let start = initialTime;
    return await new Promise((resolve) => {
      let intervalID: NodeJS.Timeout;
      const callTransaction = (): void => {
        this.client.transactions
          .get(txId)
          .then(() => {
            if (intervalID !== undefined) {
              clearInterval(intervalID);
            }
            resolve(true);
          })
          .catch((e) => {
            if (start >= 60000 * waitingMinutes) {
              // 10 min timeout
              console.error(e);
              if (intervalID !== undefined) {
                clearInterval(intervalID);
              }
              resolve(false);
            }
          });
      };
      setTimeout(() => {
        callTransaction();
        intervalID = setInterval(() => {
          start += 15000;
          callTransaction();
        }, 15000);
      }, initialTime);
    });
  }

  /**
   * Refill UTXO when there is less than 1.0 UTXO.
   */
  async convertUtxoToToken(conversionAmount: BigNumber): Promise<boolean> {
    try {
      const utxoBalance = await this.getUTXOBalance();
      console.log(`UTXO Balance: ${conversionAmount.toString()}`);
      if (new BigNumber(utxoBalance).gte(conversionAmount)) {
        const script = await this.account.getScript();
        const utxosToAccount: UtxosToAccount = {
          to: [
            {
              balances: [
                {
                  token: 0x00,
                  amount: conversionAmount,
                },
              ],
              script,
            },
          ],
        };
        const txn = await this.account
          .withTransactionBuilder()
          .account.utxosToAccount(utxosToAccount, script);
        await this.sendAndWait(txn, "utxosToAccount");
        return true;
      }
      throw new Error("Not enough UTXO to convert");
    } catch (err) {
      console.error(`Fail to convert UTXO to Token, Error: ${err.message}`);
      return false;
    }
  }
}
