describe("Go to stake page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });
  it("should open the stake page", () => {
    cy.findByTestId("cta-button-header-launch-app").should("exist").click();
  });
});

describe.only("Stake page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/app/stake");
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
