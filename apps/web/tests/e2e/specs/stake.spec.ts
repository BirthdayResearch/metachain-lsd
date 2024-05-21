describe("Connects with Metamask", () => {
  before(() => {
    // Attach up wallet
    cy.setupMetamask(Cypress.env("privateKey"), Cypress.env("network"));
    // Logout all
    cy.disconnectMetamaskWalletFromAllDapps();
    // Visit wallet connect page
    cy.visit("http://localhost:3000/app/stake");
  });

  it("synpress should show the stake page", () => {
    // Wait until the page is loaded
    cy.contains("Connect wallet to get started").should("exist");
    cy.findByTestId("cta-button-instant-transfer-btn").click();
    cy.contains("MetaMask").should("exist").click();

    // Signature request set as true
    cy.acceptMetamaskAccess();
  });
});
