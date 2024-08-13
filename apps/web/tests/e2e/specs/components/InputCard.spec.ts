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

  it("should render input card component and available DFI amount", () => {
    cy.findByTestId("input-card-amount").should("exist");
    cy.findByTestId("wallet-balance").should("have.value", "2.64"); // based on personal wallet - max amount
  });

  // Percentage button input
  it("should be able to calculate percentage", () => {
    const walletBalance = new BigNumber("2.64");
    cy.findByTestId("percentage-button-25%").click();
    cy.findByTestId("input-card-amount").should(
      "have.value",
      walletBalance.multipliedBy(0.25).toFixed(5),
    );
    cy.findByTestId("percentage-button-50%").click();
    cy.findByTestId("input-card-amount").should(
      "have.value",
      walletBalance.multipliedBy(0.5).toFixed(5),
    );
    cy.findByTestId("percentage-button-75%").click();
    cy.findByTestId("input-card-amount").should(
      "have.value",
      walletBalance.multipliedBy(0.75).toFixed(5),
    );
    cy.findByTestId("percentage-button-Max").click();
    cy.findByTestId("input-card-amount").should(
      "have.value",
      walletBalance.toString(),
    );
  });

  // Manual input
  it("should be able to type amount", () => {
    cy.findByTestId("input-card-amount").type("1");
    cy.findByTestId("input-card-amount").should("have.value", "1");
  });
  it("should only be able to type numbers", () => {
    cy.findByTestId("input-card-amount").type("abc");
    cy.findByTestId("input-card-amount").should("have.value", "");
  });
  it("should show error message when typed amount is less than minAmount", () => {
    cy.findByTestId("input-card-amount").type("0.5");
    cy.findByTestId("input-error-msg")
      .should("exist")
      .should("contain.text", "Entered amount must be at least 1 DFI.");
  });
  it("should display error message when typed amount is negative", () => {
    cy.findByTestId("input-card-amount").clear().type("-1");
    cy.findByTestId("input-error-msg")
      .should("exist")
      .should("contain.text", "Please enter a valid number.");
  });
  it("should show error message when typed amount is greater than available balance", () => {
    cy.findByTestId("input-card-amount").clear().type("100");
    cy.findByTestId("input-error-msg")
      .should("exist")
      .should(
        "contain.text",
        "Insufficient balance, please enter a valid number.",
      );
  });
});
