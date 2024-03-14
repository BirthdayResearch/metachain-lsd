import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import BigNumber from "bignumber.js";

import { MarbleLsdV1, ShareToken } from "../generated";
import {
  deployContracts,
  MarbleLsdDeploymentResult,
} from "./testUtils/deployment";
import { toWei } from "./testUtils/mathUtils";

describe("MarbleLsdProxy", () => {
  let proxyMarbleLsd: MarbleLsdV1;
  let defaultAdminSigner: SignerWithAddress;
  let rewardDistributerSigner: SignerWithAddress;
  let walletSigner: SignerWithAddress;
  let accounts: SignerWithAddress[] = [];
  let shareToken: ShareToken;

  before(async () => {
    const fixture: MarbleLsdDeploymentResult =
      await loadFixture(deployContracts);
    proxyMarbleLsd = fixture.proxyMarbleLsd;
    defaultAdminSigner = fixture.defaultAdminSigner;
    rewardDistributerSigner = fixture.rewardDistributerSigner;
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

  it("Should get receipt token name", async () => {
    const name = await shareToken.name();
    expect(name).to.equal("DFI STAKING RECEIPT TOKEN");
  });

  it("Should get receipt token symbol", async () => {
    const symbol = await shareToken.symbol();
    expect(symbol).to.equal("xDFI");
  });

  it("Should get receipt decimal", async () => {
    const decimal = await shareToken.decimals();
    expect(decimal).to.equal("18");
  });

  it("Should ensure that the owner of the ShareToken contract is set to the Staking contract.", async () => {
    const owner = await shareToken.owner();
    expect(owner).to.equal(await proxyMarbleLsd.getAddress());
  });

  it("Should fail when deposit amount is less than min deposit amount", async () => {
    const signer = accounts[4];
    await expect(
      proxyMarbleLsd.connect(signer).deposit(signer.address, { value: 0 }),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "LESS_THAN_MIN_DEPOSIT");
  });

  it("Should fail when deposit with zero receiver address", async () => {
    const signer = accounts[4];
    await expect(
      proxyMarbleLsd.connect(signer).deposit(ethers.ZeroAddress, { value: 10 }),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "ZERO_ADDRESS");
  });

  it("Should fail when withdraw zero amount", async () => {
    const signer = accounts[4];
    await expect(
      proxyMarbleLsd.withdraw(0, signer.address),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "AMOUNT_IS_ZERO");
  });

  it("Should fail when withdraw with zero receiver address", async () => {
    const signer = accounts[4];
    await expect(
      proxyMarbleLsd.connect(signer).withdraw(10, ethers.ZeroAddress),
    ).to.be.revertedWithCustomError(proxyMarbleLsd, "ZERO_ADDRESS");
  });

  it("Should fail when withdraw before staking", async () => {
    const signer = accounts[4];
    const amount = 10;
    await expect(proxyMarbleLsd.withdraw(amount, signer.address))
      .to.be.revertedWithCustomError(proxyMarbleLsd, "ExceededMaxWithdraw")
      .withArgs(signer.address, amount, 0);
  });

  it("Should deposit DFI and emit Deposit event on successful staking", async () => {
    // Need to add to the timestamp of the previous block to match the next block the tx is mined in
    const amount = toWei("10");
    const shares = amount; // considering 1:1 ratio
    const signer = accounts[4];
    await expect(
      proxyMarbleLsd.connect(signer).deposit(signer.address, { value: amount }),
    )
      .to.emit(proxyMarbleLsd, "Deposit")
      .withArgs(signer.address, signer.address, amount, shares);
    const initialSupply = await proxyMarbleLsd.totalShares();
    expect(initialSupply).to.equal(amount);
    // Check receipt token balance
    const balance = await shareToken.balanceOf(signer.address);
    expect(balance).to.equal(shares);
  });

  it("Should be able to withdraw DFI and emit Withdraw event on successful withdraw", async () => {
    const amount = toWei("5");
    const initialAssets = await proxyMarbleLsd.totalAssets();
    const initialShares = await proxyMarbleLsd.totalShares();
    const shares = await proxyMarbleLsd.convertToShares(amount);
    const signer = accounts[4];
    await expect(
      proxyMarbleLsd.connect(signer).withdraw(amount, signer.address),
    )
      .to.emit(proxyMarbleLsd, "Withdraw")
      .withArgs(signer.address, signer.address, amount, shares);
    const updatedAssets = await proxyMarbleLsd.totalAssets();
    expect(updatedAssets).to.equal(
      new BigNumber(initialAssets.toString()).minus(amount.toString()),
    );
    const updatedShares = await proxyMarbleLsd.totalShares();
    expect(updatedShares).to.equal(
      new BigNumber(initialShares.toString()).minus(shares.toString()),
    );
    // Check receipt token balance
    const balance = await shareToken.balanceOf(signer.address);
    expect(balance).to.equal(
      new BigNumber(initialShares.toString()).minus(shares.toString()),
    );
  });

  it("Should be able to redeem DFI and emit Withdraw event on successful redeem", async () => {
    const shares = toWei("5");
    const initialAssets = await proxyMarbleLsd.totalAssets();
    const initialShares = await proxyMarbleLsd.totalShares();
    const amount = await proxyMarbleLsd.convertToAssets(shares);
    const signer = accounts[4];
    await expect(proxyMarbleLsd.connect(signer).redeem(shares, signer.address))
      .to.emit(proxyMarbleLsd, "Withdraw")
      .withArgs(signer.address, signer.address, amount, shares);
    const updatedAssets = await proxyMarbleLsd.totalAssets();
    expect(updatedAssets).to.equal(
      new BigNumber(initialAssets.toString()).minus(amount.toString()),
    );
    const updatedShares = await proxyMarbleLsd.totalShares();
    expect(updatedShares).to.equal(
      new BigNumber(initialShares.toString()).minus(shares.toString()),
    );
    // Check receipt token balance
    const balance = await shareToken.balanceOf(signer.address);
    expect(balance).to.equal(
      new BigNumber(initialShares.toString()).minus(shares.toString()),
    );
  });

  describe("Minimum deposit update tests", () => {
    it("Unable to update minimum deposit if new amount is 0", async () => {
      // Test will fail with the error if input address is a dead address "0x0"
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address,
      );
      await expect(
        proxyMarbleLsd.connect(defaultAdminSigner).updateMinDeposit(0),
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "AMOUNT_IS_ZERO");
    });

    it("Unable to update minimum deposit if not DEFAULT_ADMIN_ROLE", async () => {
      const initialMinDeposit = await proxyMarbleLsd.minDeposit();
      // Test will fail if the signer is neither admin or operational admin
      const newSigner = accounts[10];
      await expect(
        proxyMarbleLsd.connect(newSigner).updateMinDeposit(toWei("1")),
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role 0x${"0".repeat(64)}`,
      );
      expect(await proxyMarbleLsd.minDeposit()).to.equal(initialMinDeposit);
    });

    it("Successfully update minimum deposit By Admin account", async () => {
      const initialMinDeposit = await proxyMarbleLsd.minDeposit();
      const newAmount = toWei("2");
      await expect(
        proxyMarbleLsd.connect(defaultAdminSigner).updateMinDeposit(toWei("2")),
      )
        .to.emit(proxyMarbleLsd, "MIN_DEPOSIT_UPDATED")
        .withArgs(initialMinDeposit, newAmount);
      expect(await proxyMarbleLsd.minDeposit()).to.equal(newAmount);
    });
  });

  describe("Wallet address update tests", () => {
    it("Unable to update if new address is 0x0", async () => {
      // Test will fail with the error if input address is a dead address "0x0"
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address,
      );
      await expect(
        proxyMarbleLsd
          .connect(defaultAdminSigner)
          .updateWalletAddress("0x0000000000000000000000000000000000000000"),
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "ZERO_ADDRESS");
    });

    it("Unable to update wallet address if not DEFAULT_ADMIN_ROLE", async () => {
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address,
      );
      // Test will fail if the signer is neither admin or operational admin
      const newSigner = accounts[10];
      await expect(
        proxyMarbleLsd
          .connect(newSigner)
          .updateWalletAddress(newSigner.address),
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role 0x${"0".repeat(64)}`,
      );
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address,
      );
    });

    it("Successfully update the wallet address By Admin account", async () => {
      expect(await proxyMarbleLsd.walletAddress()).to.equal(
        walletSigner.address,
      );
      // Change wallet address by Admin and Operational addresses
      const newSigner = accounts[10];
      await expect(
        proxyMarbleLsd
          .connect(defaultAdminSigner)
          .updateWalletAddress(newSigner.address),
      )
        .to.emit(proxyMarbleLsd, "WALLET_ADDRESS_UPDATED")
        .withArgs(walletSigner.address, newSigner.address);
      expect(await proxyMarbleLsd.walletAddress()).to.equal(newSigner.address);
    });
  });

  describe("Pause Unpause deposit and withdraw", () => {
    before(async () => {
      // pause deposit
      await expect(
        proxyMarbleLsd.connect(defaultAdminSigner).setDepositPaused(true),
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseDeposit")
        .withArgs(true, defaultAdminSigner.address);
      // pause withdraw
      await expect(
        proxyMarbleLsd.connect(defaultAdminSigner).setWithdrawPaused(true),
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseWithdraw")
        .withArgs(true, defaultAdminSigner.address);
    });

    after(async () => {
      // unpause deposit
      await expect(
        proxyMarbleLsd.connect(defaultAdminSigner).setDepositPaused(false),
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseDeposit")
        .withArgs(false, defaultAdminSigner.address);
      // unpause withdraw
      await expect(
        proxyMarbleLsd.connect(defaultAdminSigner).setWithdrawPaused(false),
      )
        .to.emit(proxyMarbleLsd, "PauseUnpauseWithdraw")
        .withArgs(false, defaultAdminSigner.address);
    });

    it("Should fail deposit when deposit is paused", async () => {
      const amount = toWei("10");
      const signer = accounts[4];
      await expect(
        proxyMarbleLsd
          .connect(signer)
          .deposit(signer.address, { value: amount }),
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "DEPOSIT_PAUSED");
    });

    it("Should fail withdraw when withdraw is paused", async () => {
      const amount = toWei("10");
      const signer = accounts[4];
      await expect(
        proxyMarbleLsd.connect(signer).withdraw(amount, signer.address),
      ).to.be.revertedWithCustomError(proxyMarbleLsd, "WITHDRAWAL_PAUSED");
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
        }),
      ).to.be.revertedWith(
        `AccessControl: account ${newSigner.address.toLowerCase()} is missing role ${hash}`,
      );
    });

    it("Should update DFI-xDFI ratio when rewards are distributed", async () => {
      // Need to add to the timestamp of the previous block to match the next block the tx is mined in
      const amount = toWei("10");
      const signer = accounts[4];
      const shares = await proxyMarbleLsd.convertToShares(amount);
      await expect(
        proxyMarbleLsd
          .connect(signer)
          .deposit(signer.address, { value: amount }),
      )
        .to.emit(proxyMarbleLsd, "Deposit")
        .withArgs(signer.address, signer.address, amount, shares);
      const initialSupply = await proxyMarbleLsd.totalShares();
      expect(initialSupply).to.equal(amount);
      const initialAssets = await proxyMarbleLsd.totalAssets();
      expect(initialAssets).to.equal(amount);
      // Check receipt token balance
      const balance = await shareToken.balanceOf(signer.address);
      expect(balance).to.equal(shares);

      // send rewards
      await expect(
        rewardDistributerSigner.sendTransaction({
          to: await proxyMarbleLsd.getAddress(),
          data: "0x",
          value: amount,
        }),
      )
        .to.emit(proxyMarbleLsd, "Rewards")
        .withArgs(rewardDistributerSigner.address, amount);
      const rewards = await proxyMarbleLsd.totalRewardAssets();
      expect(rewards).to.equal(amount);

      const updateSupply = await proxyMarbleLsd.totalShares();
      expect(updateSupply).to.equal(initialSupply);
      const updatedAssets = await proxyMarbleLsd.totalAssets();
      expect(updatedAssets).to.equal(
        new BigNumber(amount.toString()).plus(amount.toString()),
      );

      // share = 10 (xDFI) / (10 (staked) + 10 (rewards)) = 0.5 ratio
      const resultingShares = new BigNumber(amount.toString()).multipliedBy(
        0.5,
      );
      const updatedShare = await proxyMarbleLsd.convertToShares(amount);
      expect(updatedShare).to.equal(resultingShares);

      await expect(
        proxyMarbleLsd
          .connect(signer)
          .deposit(signer.address, { value: amount }),
      )
        .to.emit(proxyMarbleLsd, "Deposit")
        .withArgs(signer.address, signer.address, amount, resultingShares);
    });
  });
});
