const baseUrl = "http://localhost:3000";

describe("Go to stake page", () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });
  it("should open the stake page", () => {
    cy.findByTestId("cta-button-header-launch-app").should("exist").click();
  });
});

describe.skip("Stake page", () => {
  beforeEach(() => {
    cy.visit(`${baseUrl}/app/stake`);
  });

  it("should show the stake page", () => {
    cy.contains("Connect wallet").should("exist");
    // text should exist and should contain 'connect wallet to get started
    cy.contains("Connect wallet to get started").should("exist");
    cy.findByTestId("receiver-address-input").should("be.disabled");
    cy.findByTestId("cta-button-instant-transfer-btn").should(
      "have.text",
      "Connect wallet",
    );
  });
});

describe.only("My Test", () => {
  it("should interact with Metamask", () => {
    cy.setupMetamask();
    cy.unlockMetamask("your password");
  });
});
