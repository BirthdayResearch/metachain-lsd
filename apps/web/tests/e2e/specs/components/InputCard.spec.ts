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

  // https://github.com/CraftAcademyLabs/cypress-metamask
  it("is expected to display the local wallet address", () => {
    cy.get("[data-cy=address").should(
      "contain.text",
      "Your address is: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    );
  });
  // @ts-ignore
  it("should render input card component", async () => {
    // find the wallet balance method from metamask/synpress
    // https://docs.stealthtest.com/stealthtest-guides/testing-with-web3.js-+-cypress

    // const maxAmount = new BigNumber(100); // Example maxAmount
    // const minAmount = new BigNumber(0); // Assuming a minAmount for completeness

    cy.findByTestId("input-card-amount").should("exist");
    cy.get("[data-cy=balance").should(
      "contain.text",
      "Balance: 10000000000000000000000",
    );
  });
});
