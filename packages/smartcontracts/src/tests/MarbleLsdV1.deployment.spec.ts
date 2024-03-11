import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

import { deployContracts } from "./testUtils/deployment";

describe("MarbleLsdV1 deployment test", () => {
  it("MarbleLsdV1 should be deployed with correct Admin and wallet addresses", async () => {
    const { proxyMarbleLsd, defaultAdminSigner, walletSigner } =
      await loadFixture(deployContracts);
    // Check if the accounts[0] has the admin role.
    const DEFAULT_ADMIN_ROLE =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    expect(
      await proxyMarbleLsd.hasRole(
        DEFAULT_ADMIN_ROLE,
        defaultAdminSigner.address
      )
    ).to.equal(true);
    // Check if the relayer address is same as accounts[0]
    expect(walletSigner.address).to.be.equal(
      await proxyMarbleLsd.walletAddress()
    );
    // checking Contract version, should be 1
    expect(await proxyMarbleLsd.version()).to.be.equal("1");
  });

  it("Successfully fetching constants", async () => {
    const { proxyMarbleLsd } = await loadFixture(deployContracts);
    expect(await proxyMarbleLsd.NAME()).to.be.equal("MARBLE_LSD");
  });
});
