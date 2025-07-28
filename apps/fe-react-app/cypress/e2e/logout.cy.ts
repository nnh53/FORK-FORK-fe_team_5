describe("Logout", () => {
  beforeEach(() => cy.visit("/"));

  it("logout in admin", () => {
    // Login
    cy.contains("Login").click();
    cy.get("input[name='email']").type("admin1@fcinema.com");
    cy.get("input[name='password']").type("123123123");
    cy.get("button[type='submit']").click();

    // Open admin dropdown menu
    cy.get("[data-testid='admin-menu-trigger']").click();

    // Click "Log out" menu item
    cy.contains("Log out").trigger("mouseover");
    cy.contains("Log out").should("be.visible");
    cy.contains("Log out").click();

    // Verify redirect to home page
    cy.url().should("include", "/auth/login");
  });

  it("logout in user", () => {
    // Login
    cy.contains("Login").click();
    cy.get("input[name='email']").type("member@gmail.com");
    cy.get("input[name='password']").type("member123");
    cy.get("button[type='submit']").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    // Open user dropdown menu
    cy.get("[avatar-id='avatar-menu-trigger']").click();
    cy.contains("Log out").trigger("mouseover");
    cy.contains("Log out").should("be.visible");
    cy.contains("Log out").click();
  });
});
