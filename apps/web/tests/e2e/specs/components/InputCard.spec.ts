// import BigNumber from "bignumber.js";

describe("InputCard component", () => {
  before(() => {
    // Attach up wallet
    cy.setupMetamask(Cypress.env("privateKey"), Cypress.env("network"));
    // Logout all
    cy.disconnectMetamaskWalletFromAllDapps();
    // Visit wallet connect page
    cy.visit("http://localhost:3000/app/stake");
  });
  it("should render input card component", () => {
    // find the wallet balance method from metamask/synpress
    // https://docs.stealthtest.com/stealthtest-guides/testing-with-web3.js-+-cypress

    // const maxAmount = new BigNumber(100); // Example maxAmount
    // const minAmount = new BigNumber(0); // Assuming a minAmount for completeness

    cy.findByTestId("input-card-amount").should("exist");
  });
});
