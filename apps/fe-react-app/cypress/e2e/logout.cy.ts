describe("Logout", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Login").should("be.visible");
    cy.contains("Login").click();
  });

  it("logout in admin", () => {
    cy.get("input[name='email']").type("admin1@fcinema.com");
    cy.get("input[name='password']").type("123123123");
    cy.get("button[type='submit']").click();

    // Open admin dropdown menu
    cy.get("[data-testid='admin-menu-trigger']").click();
    cy.contains("Log out").trigger("mouseover");
    cy.contains("Log out").should("be.visible");
    cy.contains("Log out").click();

    cy.url().should("include", "/auth/login");
  });

  it("logout in user", () => {
    cy.get("input[name='email']").type("member@gmail.com");
    cy.get("input[name='password']").type("member123");
    cy.get("button[type='submit']").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);

    cy.get("[avatar-id='avatar-menu-trigger']").click();
    cy.contains("Log out").trigger("mouseover");
    cy.contains("Log out").should("be.visible");
    cy.contains("Log out").click();
  });
});
