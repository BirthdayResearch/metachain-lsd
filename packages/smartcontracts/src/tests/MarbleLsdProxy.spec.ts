import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import BigNumber from "bignumber.js";
import { expect } from "chai";
import { ethers } from "hardhat";

import { MarbleLsdV1, ShareToken } from "../generated";
import {
  deployContracts,
  MarbleLsdDeploymentResult,
} from "./testUtils/deployment";
import { feesOnRaw, feesOnTotal, toWei } from "./testUtils/mathUtils";

describe("MarbleLsdProxy", () => {
  let proxyMarbleLsd: MarbleLsdV1;
  let defaultAdminSigner: SignerWithAddress;
  let rewardDistributerAndFinalizeSigner: SignerWithAddress;
  let administratorSigner: SignerWithAddress;
  let walletSigner: SignerWithAddress;
  let accounts: SignerWithAddress[] = [];
  let shareToken: ShareToken;

  before(async () => {
    const fixture: MarbleLsdDeploymentResult = await loadFixture(
      deployContracts
    );
    proxyMarbleLsd = fixture.proxyMarbleLsd;
    defaultAdminSigner = fixture.defaultAdminSigner;
    administratorSigner = fixture.administratorSigner;
    rewardDistributerAndFinalizeSigner =
      fixture.rewardDistributerAndFinalizeSigner;
    walletSigner = fixture.walletSigner;
    shareToken = fixture.shareToken;
    accounts = await ethers.getSigners();
  });

  it("Should have total supply=0 before depositing any DFI", async () => {
    const initialSupply = await proxyMarbleLsd.totalShares();
    expect(initialSupply).to.equal("0");
  });

  it("Should have total rewards assets=0 before depositing any DFI rewards", async () => {
    const initialSupply = await proxyMarbleLsd.totalRewardAssets();
    expect(initialSupply).to.equal("0");
  });

  it("Should have max deposit value as 2 ** 256 - 1", async () => {
    const signer = accounts[5];
    const masDeposit = await proxyMarbleLsd.maxDeposit(signer.address);
    const expectedMaxDeposit = new BigNumber("2").pow(256).minus(1);
    expect(new BigNumber(masDeposit.toString())).to.eql(expectedMaxDeposit);
  });

  it("Should have max withdrawal value as 0 when no deposit value", async () => {
    const signer = accounts[5];
    const maxWithdrawal = await proxyMarbleLsd.maxWithdrawal(signer.address);
    expect(maxWithdrawal.toString()).to.equal("0");
  });

  it("Should have minDeposit=1 DFI", async () => {
    const minDeposit = await proxyMarbleLsd.minDeposit();
    expect(minDeposit).to.equal(toWei("1"));
  });

  it("Should have minWithdrawal=1 mDFI", async () => {
    const minWithdrawal = await proxyMarbleLsd.minWithdrawal();
    expect(minWithdrawal).to.equal(toWei("1"));
  });

  it("Should have total supply=0 before depositing any DFI", async () => {
    const minDeposit = await proxyMarbleLsd.minDeposit();
    expect(minDeposit).to.equal(toWei("1"));
  });

  it("Should have convert to shares ratio to 1:1 before staking any assets", async () => {
    const amount = toWei("10");
    const shares = await proxyMarbleLsd.convertToShares(amount);
    expect(shares).to.equal(amount);
  });

  it("Should have convert to assets ratio to 1:1 before staking any assets", async () => {
    const shares = toWei("10");
    const assets = await proxyMarbleLsd.convertToAssets(shares);
    expect(assets).to.equal(shares);
  });

  it("Should have recept token deployed", async () => {
    const address = await proxyMarbleLsd.shareToken();
    expect(address).to.not.equal(null);
    expect(address.length).to.equal(42);
  });

  it("Should not flush fund if contract have zero amount to withdrawal ", async () => {
    const availableFundsToFlush =
      await proxyMarbleLsd.getAvailableFundsToFlush();
    expect(availableFundsToFlush).to.equal(new BigNumber(0));
    await expect(
      proxyMarbleLsd.connect(defaultAdminSigner).flushFunds()
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "AMOUNT_IS_ZERO");
  });

  it("Should get receipt token name", async () => {
    const name = await shareToken.name();
    expect(name).to.equal("DFI STAKING SHARE TOKEN");
  });

  it("Should get receipt token symbol", async () => {
    const symbol = await shareToken.symbol();
    expect(symbol).to.equal("mDFI");
  });

  it("Should get receipt decimal", async () => {
    const decimal = await shareToken.decimals();
    expect(decimal).to.equal("18");
  });

  it("Should ensure that the owner of the ShareToken contract is set to the Staking contract.", async () => {
    const owner = await shareToken.owner();
    expect(owner).to.equal(await proxyMarbleLsd.getAddress());
  });

  it("Should get default entry at index 0", async () => {
    const withdrawReq = await proxyMarbleLsd.getWithdrawalRequests(
      ethers.ZeroAddress
    );
    expect(withdrawReq.length).to.equal(0);
    await expect(proxyMarbleLsd.getWithdrawalStatus([0]))
      .to.be.revertedWithCustomError(proxyMarbleLsd, "InvalidRequestId")
      .withArgs(0);
  });

  it("Should fail when deposit amount is less than min deposit amount", async () => {
    const signer = accounts[5];
    await expect(
      proxyMarbleLsd.connect(signer).deposit(signer.address, { value: 0 })
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "LESS_THAN_MIN_DEPOSIT");
  });

  it("Should fail when deposit with zero receiver address", async () => {
    const signer = accounts[5];
    await expect(
      proxyMarbleLsd
        .connect(signer)
        .deposit(ethers.ZeroAddress, { value: toWei("10") })
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "ZERO_ADDRESS");
  });

  it("Should fail when deposit with less than min deposit amount", async () => {
    const signer = accounts[5];
    await expect(
      proxyMarbleLsd.connect(signer).deposit(signer.address, { value: 10 })
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "LESS_THAN_MIN_DEPOSIT");
  });

  it("Should fail when request withdrawal with less than min withdrawal", async () => {
    const signer = accounts[5];
    await expect(
      proxyMarbleLsd.requestWithdrawal(0, signer.address)
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "LESS_THAN_MIN_WITHDRAWAL");
  });

  it("Should fail when request withdrawal with zero receiver address", async () => {
    const signer = accounts[5];
    await expect(
      proxyMarbleLsd
        .connect(signer)
        .requestWithdrawal(toWei("10"), ethers.ZeroAddress)
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "ZERO_ADDRESS");
  });

  it("Should fail when request withdrawal before staking", async () => {
    const signer = accounts[5];
    const amount = toWei("10");
    await expect(proxyMarbleLsd.requestWithdrawal(amount, signer.address))
      .to.be.revertedWithCustomError(proxyMarbleLsd, "ExceededMaxWithdrawal")
      .withArgs(signer.address, amount, 0);
  });

  it("Should fail when request withdrawal with less than min withdrawal amount", async () => {
    const signer = accounts[5];
    const amount = 10;
    await expect(
      proxyMarbleLsd.requestWithdrawal(amount, signer.address)
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "LESS_THAN_MIN_WITHDRAWAL");
  });

  it("Should deposit DFI and emit Deposit event on successful staking", async () => {
    // Need to add to the timestamp of the previous block to match the next block the tx is mined in
    const amount = toWei("10.05");
    const mintingFees = await proxyMarbleLsd.mintingFees();
    const fees = feesOnTotal(amount.toString(), mintingFees.toString());
    const amountBeforeFees = new BigNumber(amount.toString()).minus(fees);
    const initialStaked = await proxyMarbleLsd.totalStakedAssets();
    const signer = accounts[5];
    const previewDeposit = await proxyMarbleLsd.previewDeposit(amount);
    const convertToShares = await proxyMarbleLsd.convertToShares(amount);
    expect(fees).to.equal(
      new BigNumber(convertToShares.toString()).minus(previewDeposit.toString())
    );
    const shares = amountBeforeFees; // considering 1:1 ratio
    await expect(
      proxyMarbleLsd.connect(signer).deposit(signer.address, { value: amount })
    )
      .to.emit(proxyMarbleLsd, "Deposit")
      .withArgs(signer.address, signer.address, amountBeforeFees, shares, fees);
    const initialSupply = await proxyMarbleLsd.totalShares();
    expect(initialSupply).to.equal(amountBeforeFees);
    const updatedStaked = await proxyMarbleLsd.totalStakedAssets();
    expect(
      new BigNumber(updatedStaked.toString()).minus(initialStaked.toString())
    ).to.equal(amountBeforeFees);
    // Check receipt token balance
    const balance = await shareToken.balanceOf(signer.address);
    expect(balance).to.equal(shares);
  });

  it("Should fail to request withdrawal DFI before approval of shareToken", async () => {
    const amount = toWei("5");
    const signer = accounts[5];
    await expect(
      proxyMarbleLsd.connect(signer).requestWithdrawal(amount, signer.address)
    ).to.be.revertedWith("ERC20: insufficient allowance");
  });

  it("Should be able to request withdrawal DFI and emit WithdrawalRequested event on successful withdraw", async () => {
    const amount = toWei("4.962779156327543424"); // to withdrawal 5 mDFI
    const shares = await proxyMarbleLsd.previewWithdrawal(amount); // 5 mDFI
    const redemptionFees = await proxyMarbleLsd.redemptionFees();
    const fees = feesOnRaw(amount.toString(), redemptionFees.toString());
    const amountAfterFees = new BigNumber(amount.toString()).plus(fees);
    const previewWithdrawal = await proxyMarbleLsd.previewWithdrawal(amount);
    const convertToShares = await proxyMarbleLsd.convertToShares(amount);
    expect(fees).to.equal(
      new BigNumber(previewWithdrawal.toString()).minus(
        convertToShares.toString()
      )
    );
    const signer = accounts[5];
    const lastRequestId = +(await proxyMarbleLsd.lastRequestId()).toString();
    // approve transfer of share token
    await shareToken
      .connect(signer)
      .approve(await proxyMarbleLsd.getAddress(), shares);
    await expect(
      proxyMarbleLsd.connect(signer).requestWithdrawal(amount, signer.address)
    )
      .to.emit(proxyMarbleLsd, "WithdrawalRequested")
      .withArgs(
        lastRequestId + 1,
        signer.address,
        signer.address,
        amount,
        shares,
        fees
      );
    const updatedLastRequestId = +(
      await proxyMarbleLsd.lastRequestId()
    ).toString();
    expect(updatedLastRequestId).to.equal(lastRequestId + 1);
    const withdrawArr = await proxyMarbleLsd.getWithdrawalStatus([
      updatedLastRequestId,
    ]);
    expect(withdrawArr[0]).to.eql([
      BigInt(amount),
      BigInt(amountAfterFees.toString()),
      BigInt(fees.toString()),
      signer.address,
      signer.address,
      BigInt(await time.latest()),
      false,
      false,
    ]);
    const withdrawalRequests = await proxyMarbleLsd.getWithdrawalRequests(
      signer.address
    );
    expect(withdrawalRequests.length).to.equal(1);
    expect(withdrawalRequests).to.eql([1n]);
  });

  it("Should fail claim when request claim withdrawals before finalizing withdraw", async () => {
    const signer = accounts[5];
    const withdrawalRequests = await proxyMarbleLsd.getWithdrawalRequests(
      signer.address
    );
    await expect(
      proxyMarbleLsd.connect(signer).claimWithdrawal(withdrawalRequests[0])
    )
      .to.be.revertedWithCustomError(
        proxyMarbleLsd,
        "RequestNotFoundOrNotFinalized"
      )
      .withArgs(withdrawalRequests[0]);
  });

  it("Should fail claim with RequestAlreadyClaimed, when request claim withdrawals with zero request Id", async () => {
    const signer = accounts[5];
    await expect(proxyMarbleLsd.connect(signer).claimWithdrawal(0))
      .to.be.revertedWithCustomError(proxyMarbleLsd, "RequestAlreadyClaimed")
      .withArgs(0);
  });

  it("Should fail when finalizing withdraw with non FINALIZE_ROLE address ", async () => {
    const signer = accounts[5];
    const lastRequestId = await proxyMarbleLsd.lastRequestId();
    const finalizeRoleHash = await proxyMarbleLsd.FINALIZE_ROLE();

    await expect(
      proxyMarbleLsd.connect(signer).finalize(lastRequestId)
    ).to.be.revertedWith(
      `AccessControl: account ${signer.address.toLowerCase()} is missing role ${finalizeRoleHash}`
    );
  });

  it("Should fail when finalizing withdraw with zero amount", async () => {
    const lastRequestId = await proxyMarbleLsd.lastRequestId();
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .finalize(lastRequestId)
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "AMOUNT_IS_ZERO");
  });

  it("Should fail when finalizing withdraw with invalid requestId", async () => {
    const amount = toWei("10");
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .finalize(10, { value: amount })
    )
      .to.be.revertedWithCustomError(proxyMarbleLsd, "InvalidRequestId")
      .withArgs(10);
  });

  it("Should fail when finalizing withdraw with finalized requestId", async () => {
    const amount = toWei("10");
    const lastFinalizedRequestId =
      await proxyMarbleLsd.lastFinalizedRequestId();
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .finalize(lastFinalizedRequestId, { value: amount })
    )
      .to.be.revertedWithCustomError(proxyMarbleLsd, "InvalidRequestId")
      .withArgs(lastFinalizedRequestId);
  });

  it("Should fail when finalizing withdraw with wrong finalizing amount", async () => {
    const amount = toWei("10");
    const lastRequestId = await proxyMarbleLsd.lastRequestId();
    const preFinalize = await proxyMarbleLsd.prefinalize([lastRequestId]);
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .finalize(lastRequestId, { value: amount })
    )
      .to.be.revertedWithCustomError(proxyMarbleLsd, "InvalidAssetsToFinalize")
      .withArgs(amount, preFinalize.assetsToLock);
  });

  it("Should have correct unfinalized assets count and request number", async () => {
    const unfinalizedAssets = await proxyMarbleLsd.unfinalizedAssets();
    const lastRequestId = await proxyMarbleLsd.lastRequestId();
    const unfinalizedRequestNumber =
      await proxyMarbleLsd.unfinalizedRequestNumber();
    expect(unfinalizedRequestNumber).to.equal(lastRequestId);
    const preFinalize = await proxyMarbleLsd.prefinalize([lastRequestId]);
    expect(preFinalize.assetsToLock).to.equal(
      new BigNumber(unfinalizedAssets?.assets?.toString()).plus(
        unfinalizedAssets?.fees?.toString()
      )
    );
  });

  it("Should be able to finalizing withdraw with correct finalizing amount", async () => {
    const lastFinalizedRequestId = +(
      await proxyMarbleLsd.lastFinalizedRequestId()
    ).toString();
    const lastRequestId = await proxyMarbleLsd.lastRequestId();
    const preFinalize = await proxyMarbleLsd.prefinalize([lastRequestId]);
    const blockTime = await time.latest();
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .finalize(lastRequestId, { value: preFinalize.assetsToLock })
    )
      .to.emit(proxyMarbleLsd, "WithdrawalsFinalized")
      .withArgs(
        lastFinalizedRequestId + 1,
        lastRequestId,
        preFinalize.assetsToLock,
        preFinalize.sharesToBurn,
        blockTime + 1
      );
  });

  it("Should not able to claim withdrawal with non owner account", async () => {
    const owner = accounts[5];
    const signer = accounts[6];
    const withdrawalRequests = await proxyMarbleLsd.getWithdrawalRequests(
      owner.address
    );
    await expect(
      proxyMarbleLsd.connect(signer).claimWithdrawal(withdrawalRequests[0])
    )
      .to.be.revertedWithCustomError(proxyMarbleLsd, "NotOwner")
      .withArgs(signer.address, owner.address);
  });

  it("Should be able to claim withdrawal with WithdrawalClaimed event", async () => {
    const signer = accounts[5];
    const requests = (
      await proxyMarbleLsd.getWithdrawalRequests(signer.address)
    ).map((i) => i.toString());
    const withdrawalStatus = await proxyMarbleLsd.getWithdrawalStatus(requests);
    const initialStaked = await proxyMarbleLsd.totalStakedAssets();
    const initialTotalSupply = await shareToken.totalSupply();
    const initialAssets = await proxyMarbleLsd.totalAssets();
    const initialShares = await proxyMarbleLsd.totalShares();
    let allAssets = new BigNumber(0);
    let allShares = new BigNumber(0);
    let allFees = new BigNumber(0);
    for (let i = 0; i < requests.length; i += 1) {
      const [assets, shares, fees] = withdrawalStatus[i];
      const requestId = requests[i];
      await expect(proxyMarbleLsd.connect(signer).claimWithdrawal(requestId))
        .to.emit(proxyMarbleLsd, "WithdrawalClaimed")
        .withArgs(
          requestId,
          signer.address,
          signer.address,
          assets,
          shares,
          fees
        );
      allAssets = allAssets.plus(assets.toString());
      allShares = allShares.plus(shares.toString());
      allFees = allFees.plus(fees.toString());
    }
    const updatedAssets = await proxyMarbleLsd.totalAssets();
    expect(updatedAssets).to.equal(
      new BigNumber(initialAssets.toString())
        .minus(allAssets.toString())
        .minus(allFees.toString())
    );
    const updatedShares = await proxyMarbleLsd.totalShares();
    expect(updatedShares).to.equal(
      new BigNumber(initialShares.toString()).minus(allShares.toString())
    );
    // Check receipt token balance
    const balance = await shareToken.balanceOf(signer.address);
    expect(balance).to.equal(
      new BigNumber(initialShares.toString()).minus(allShares.toString())
    );
    const totalSupply = await shareToken.totalSupply();
    expect(totalSupply).to.equal(
      new BigNumber(initialTotalSupply.toString()).minus(allShares.toString())
    );
    const updatedStaked = await proxyMarbleLsd.totalStakedAssets();
    expect(
      new BigNumber(initialStaked.toString()).minus(updatedStaked.toString())
    ).to.equal(new BigNumber(allAssets).plus(allFees.toString()));
  });

  it("Should not able to re-claim withdrawal", async () => {
    const signer = accounts[5];
    const lastFinalizedRequestId = +(
      await proxyMarbleLsd.lastFinalizedRequestId()
    ).toString();
    await expect(
      proxyMarbleLsd.connect(signer).claimWithdrawal(lastFinalizedRequestId)
    )
      .to.be.revertedWithCustomError(proxyMarbleLsd, "RequestAlreadyClaimed")
      .withArgs(lastFinalizedRequestId);
  });

  it("Should be able to request redeem DFI and claim rewards with WithdrawalClaimed event", async () => {
    const signer = accounts[5];
    const shares = toWei("5");
    const initialTotalSupply = await shareToken.totalSupply();
    const initialAssets = await proxyMarbleLsd.totalAssets();
    const initialShares = await proxyMarbleLsd.totalShares();
    const lastRequestId = +(await proxyMarbleLsd.lastRequestId()).toString();
    const lastFinalizedRequestId = +(
      await proxyMarbleLsd.lastFinalizedRequestId()
    ).toString();
    const redemptionFees = await proxyMarbleLsd.redemptionFees();
    const previewRedeem = await proxyMarbleLsd.previewRedeem(shares);
    const convertToAssets = await proxyMarbleLsd.convertToAssets(shares);
    const fees = feesOnTotal(
      convertToAssets.toString(),
      redemptionFees.toString()
    );
    expect(fees).to.equal(
      new BigNumber(convertToAssets.toString()).minus(previewRedeem.toString())
    );
    // approve transfer of share token
    await shareToken
      .connect(signer)
      .approve(await proxyMarbleLsd.getAddress(), convertToAssets);
    const amountAfterFees = new BigNumber(convertToAssets.toString()).minus(
      fees
    );
    await expect(
      proxyMarbleLsd.connect(signer).requestRedeem(shares, signer.address)
    )
      .to.emit(proxyMarbleLsd, "WithdrawalRequested")
      .withArgs(
        lastRequestId + 1,
        signer.address,
        signer.address,
        amountAfterFees,
        shares,
        fees
      );
    const preFinalize = await proxyMarbleLsd.prefinalize([
      lastFinalizedRequestId + 1,
    ]);
    const blockTime = await time.latest();
    await expect(
      proxyMarbleLsd
        .connect(rewardDistributerAndFinalizeSigner)
        .finalize(lastFinalizedRequestId + 1, {
          value: preFinalize.assetsToLock,
        })
    )
      .to.emit(proxyMarbleLsd, "WithdrawalsFinalized")
      .withArgs(
        lastFinalizedRequestId + 1,
        lastFinalizedRequestId + 1,
        preFinalize.assetsToLock,
        preFinalize.sharesToBurn,
        blockTime + 1
      );
    const withdrawalRequests = (
      await proxyMarbleLsd.getWithdrawalRequests(signer.address)
    ).map((i) => i.toString());
    await expect(
      proxyMarbleLsd.connect(signer).claimWithdrawals(withdrawalRequests)
    )
      .to.emit(proxyMarbleLsd, "WithdrawalClaimed")
      .withArgs(
        withdrawalRequests[0],
        signer.address,
        signer.address,
        amountAfterFees,
        shares,
        fees
      );

    const updatedAssets = await proxyMarbleLsd.totalAssets();
    expect(updatedAssets).to.equal(
      new BigNumber(initialAssets.toString()).minus(convertToAssets.toString())
    );
    const updatedShares = await proxyMarbleLsd.totalShares();
    expect(updatedShares).to.equal(
      new BigNumber(initialShares.toString()).minus(shares.toString())
    );
    // Check receipt token balance
    const balance = await shareToken.balanceOf(signer.address);
    expect(balance).to.equal(
      new BigNumber(initialShares.toString()).minus(shares.toString())
    );
    const totalSupply = await shareToken.totalSupply();
    expect(totalSupply).to.equal(
      new BigNumber(initialTotalSupply.toString()).minus(shares.toString())
    );
  });

  describe("Minimum deposit update tests", () => {
    it("Should not update minimum deposit if new amount is 0", async () => {
      // Test will fail with the error if input address is a dead address "0x0"
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address
      );
      await expect(
        proxyMarbleLsd.connect(administratorSigner).updateMinDeposit(0)
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "AMOUNT_IS_ZERO");
    });

    it("Should not update minimum deposit if not ADMINISTRATOR_ROLE", async () => {
      const initialMinDeposit = await proxyMarbleLsd.minDeposit();
      // Test will fail if the signer is neither admin or operational admin
      const newSigner = accounts[10];
      const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
      await expect(
        proxyMarbleLsd.connect(newSigner).updateMinDeposit(toWei("1"))
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role ${administratorRoleHash}`
      );
      expect(await proxyMarbleLsd.minDeposit()).to.equal(initialMinDeposit);
    });

    it("Should update minimum deposit By Admin account", async () => {
      const initialMinDeposit = await proxyMarbleLsd.minDeposit();
      const newAmount = toWei("2");
      await expect(
        proxyMarbleLsd.connect(administratorSigner).updateMinDeposit(toWei("2"))
      )
        .to.emit(proxyMarbleLsd, "MIN_DEPOSIT_UPDATED")
        .withArgs(initialMinDeposit, newAmount);
      expect(await proxyMarbleLsd.minDeposit()).to.equal(newAmount);
    });
  });

  describe("Minimum withdrawal update tests", () => {
    it("Should not update minimum withdrawal if new amount is 0", async () => {
      // Test will fail with the error if input address is a dead address "0x0"
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address
      );
      await expect(
        proxyMarbleLsd.connect(administratorSigner).updateMinWithdrawal(0)
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "AMOUNT_IS_ZERO");
    });

    it("Should not update minimum deposit if not ADMINISTRATOR_ROLE", async () => {
      const initialMinWithdrawal = await proxyMarbleLsd.minWithdrawal();
      // Test will fail if the signer is neither admin or operational admin
      const newSigner = accounts[10];
      const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
      await expect(
        proxyMarbleLsd.connect(newSigner).updateMinWithdrawal(toWei("1"))
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role ${administratorRoleHash}`
      );
      expect(await proxyMarbleLsd.minWithdrawal()).to.equal(
        initialMinWithdrawal
      );
    });

    it("Should update minimum deposit By Admin account", async () => {
      const initialMinWithdrawal = await proxyMarbleLsd.minWithdrawal();
      const newAmount = toWei("2");
      await expect(
        proxyMarbleLsd
          .connect(administratorSigner)
          .updateMinWithdrawal(toWei("2"))
      )
        .to.emit(proxyMarbleLsd, "MIN_WITHDRAWAL_UPDATED")
        .withArgs(initialMinWithdrawal, newAmount);
      expect(await proxyMarbleLsd.minWithdrawal()).to.equal(newAmount);
    });
  });

  describe("Flush funds", () => {
    it("Should flush fund if contract have more than zero amount to withdrawal ", async () => {
      const availableFundsToFlush =
        await proxyMarbleLsd.getAvailableFundsToFlush();
      const walletAddress = await proxyMarbleLsd.walletAddress();
      const initialBalance = await ethers.provider.getBalance(walletAddress);
      expect(availableFundsToFlush).to.greaterThan(new BigNumber(0));
      await proxyMarbleLsd.connect(defaultAdminSigner).flushFunds();
      const updatedBalance = await ethers.provider.getBalance(walletAddress);
      const updatedBalanceBigInt = new BigNumber(updatedBalance.toString());
      const initialBalanceBigInt = new BigNumber(initialBalance.toString());
      const availableFundsToFlushBigInt = new BigNumber(
        availableFundsToFlush.toString()
      );
      expect(updatedBalanceBigInt.toFixed()).to.equal(
        initialBalanceBigInt.plus(availableFundsToFlushBigInt).toFixed()
      );
    });
  });

  describe("Wallet address update tests", () => {
    it("Should not update if new address is 0x0", async () => {
      // Test will fail with the error if input address is a dead address "0x0"
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address
      );
      await expect(
        proxyMarbleLsd
          .connect(defaultAdminSigner)
          .updateWalletAddress("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "ZERO_ADDRESS");
    });

    it("Should not update wallet address if not DEFAULT_ADMIN_ROLE", async () => {
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address
      );
      // Test will fail if the signer is neither admin or operational admin
      const newSigner = accounts[10];
      await expect(
        proxyMarbleLsd.connect(newSigner).updateWalletAddress(newSigner.address)
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role 0x${"0".repeat(
          64
        )}`
      );
    });

    it("Should update the wallet address By Admin account", async () => {
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address
      );
      // Change wallet address by Admin and Operational addresses
      const newSigner = accounts[10];
      await expect(
        proxyMarbleLsd
          .connect(defaultAdminSigner)
          .updateWalletAddress(newSigner.address)
      )
        .to.emit(proxyMarbleLsd, "WALLET_ADDRESS_UPDATED")
        .withArgs(walletSigner.address, newSigner.address);
      expect(await proxyMarbleLsd.walletAddress()).to.equal(newSigner.address);
    });
  });

  describe("Pause Unpause deposit and withdraw", () => {
    it("Should not pause deposit when not called from administrator", async () => {
      const signer = accounts[5];
      const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
      await expect(
        proxyMarbleLsd.connect(signer).setDepositPaused(true)
      ).to.be.revertedWith(
        `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`
      );
    });

    it("Should pause deposit when called from administrator", async () => {
      await expect(
        proxyMarbleLsd.connect(administratorSigner).setDepositPaused(true)
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseDeposit")
        .withArgs(true, administratorSigner.address);
    });

    it("Should fail deposit when deposit is paused", async () => {
      const amount = toWei("10");
      const signer = accounts[5];
      await expect(
        proxyMarbleLsd
          .connect(signer)
          .deposit(signer.address, { value: amount })
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "DEPOSIT_PAUSED");
    });

    it("Should not unpause deposit when not called from administrator", async () => {
      const signer = accounts[5];
      const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
      await expect(
        proxyMarbleLsd.connect(signer).setDepositPaused(false)
      ).to.be.revertedWith(
        `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`
      );
    });

    it("Should unpause deposit when called from administrator", async () => {
      await expect(
        proxyMarbleLsd.connect(administratorSigner).setDepositPaused(false)
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseDeposit")
        .withArgs(false, administratorSigner.address);
    });

    it("Should not pause withdrawal when not called from administrator", async () => {
      const signer = accounts[5];
      const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
      await expect(
        proxyMarbleLsd.connect(signer).setWithdrawalPaused(true)
      ).to.be.revertedWith(
        `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`
      );
    });

    it("Should pause withdrawal when called from administrator", async () => {
      await expect(
        proxyMarbleLsd.connect(administratorSigner).setWithdrawalPaused(true)
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseWithdrawal")
        .withArgs(true, administratorSigner.address);
    });

    it("Should fail withdraw when withdraw is paused", async () => {
      const amount = toWei("10");
      const signer = accounts[5];
      await expect(
        proxyMarbleLsd.connect(signer).requestWithdrawal(amount, signer.address)
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "WITHDRAWAL_PAUSED");
    });

    it("Should fail redeem when withdrawal is paused", async () => {
      const amount = toWei("10");
      const signer = accounts[5];
      await expect(
        proxyMarbleLsd.connect(signer).requestRedeem(amount, signer.address)
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "WITHDRAWAL_PAUSED");
    });

    it("Should not unpause withdrawal when not called from administrator", async () => {
      const signer = accounts[5];
      const administratorRoleHash = await proxyMarbleLsd.ADMINISTRATOR_ROLE();
      await expect(
        proxyMarbleLsd.connect(signer).setWithdrawalPaused(false)
      ).to.be.revertedWith(
        `AccessControl: account ${signer.address.toLowerCase()} is missing role ${administratorRoleHash}`
      );
    });

    it("Should unpause withdrawal when called from administrator", async () => {
      await expect(
        proxyMarbleLsd.connect(administratorSigner).setWithdrawalPaused(false)
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseWithdrawal")
        .withArgs(false, administratorSigner.address);
    });
  });

  describe("Manage rewards", () => {
    it("Should fail if distributed rewards with non REWARDS_DISTRIBUTER_ROLE", async () => {
      const amount = toWei("10");
      const hash = await proxyMarbleLsd.REWARDS_DISTRIBUTER_ROLE();
      // send rewards
      const newSigner = accounts[10];
      await expect(
        newSigner.sendTransaction({
          to: await proxyMarbleLsd.getAddress(),
          data: "0x",
          value: amount,
        })
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role ${hash}`
      );
    });

    it("Should update DFI-mDFI ratio when rewards are distributed", async () => {
      // Need to add to the timestamp of the previous block to match the next block the tx is mined in
      const amount = toWei("10.05");
      const signer = accounts[5];
      const mintingFees = await proxyMarbleLsd.mintingFees();
      const fees = feesOnTotal(amount.toString(), mintingFees.toString());
      const amountAfterFees = new BigNumber(amount.toString()).minus(fees);
      const shares = await proxyMarbleLsd.convertToShares(
        amountAfterFees.toString()
      );
      await expect(
        proxyMarbleLsd
          .connect(signer)
          .deposit(signer.address, { value: amount })
      )
        .to.emit(proxyMarbleLsd, "Deposit")
        .withArgs(
          signer.address,
          signer.address,
          amountAfterFees,
          shares,
          fees
        );
      const initialSupply = await proxyMarbleLsd.totalShares();
      expect(initialSupply).to.equal(shares);
      const initialAssets = await proxyMarbleLsd.totalAssets();
      expect(initialAssets).to.equal(amountAfterFees);
      // Check receipt token balance
      const balance = await shareToken.balanceOf(signer.address);
      expect(balance).to.equal(shares);
      const performanceFees = await proxyMarbleLsd.performanceFees();
      const performanceAmount = feesOnRaw(
        amountAfterFees.toString(),
        performanceFees.toString()
      );
      const rewardsWithFees = new BigNumber(amountAfterFees.toString()).plus(
        performanceAmount
      );
      // send rewards
      await expect(
        rewardDistributerAndFinalizeSigner.sendTransaction({
          to: await proxyMarbleLsd.getAddress(),
          data: "0x",
          value: rewardsWithFees.toString(),
        })
      )
        .to.emit(proxyMarbleLsd, "Rewards")
        .withArgs(
          rewardDistributerAndFinalizeSigner.address,
          amountAfterFees,
          performanceAmount
        );
      const rewards = await proxyMarbleLsd.totalRewardAssets();
      expect(rewards).to.equal(amountAfterFees);

      const updateSupply = await proxyMarbleLsd.totalShares();
      expect(updateSupply).to.equal(initialSupply);
      const updatedAssets = await proxyMarbleLsd.totalAssets();
      expect(updatedAssets).to.equal(
        new BigNumber(amountAfterFees.toString()).multipliedBy(2)
      );

      // share = 10 (mDFI) / (10 (staked) + 10 (rewards)) = 0.5 ratio
      const resultingShares = new BigNumber(
        amountAfterFees.toString()
      ).multipliedBy(0.5);
      const updatedShare = await proxyMarbleLsd.previewDeposit(amount);
      expect(updatedShare).to.equal(resultingShares);

      await expect(
        proxyMarbleLsd
          .connect(signer)
          .deposit(signer.address, { value: amount })
      )
        .to.emit(proxyMarbleLsd, "Deposit")
        .withArgs(
          signer.address,
          signer.address,
          amountAfterFees,
          resultingShares,
          fees
        );
    });
  });
});
