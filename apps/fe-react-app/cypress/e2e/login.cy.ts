describe("Role Route To Each Page", () => {
  beforeEach(() => cy.visit("/"));

  it("login by admin account", () => {
    cy.contains("Login").should("be.visible");
    cy.contains("Login").click();

    cy.get("input[name='email']").type("admin1@fcinema.com");

    cy.get("input[name='password']").type("123123123");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/admin/dashboard");
    cy.pause();
  });

  it("login by staff account", () => {
    cy.contains("Login").click();

    cy.get("input[name='email']").type("staff1@fcinema.com");
    cy.get("input[name='password']").type("123123123");

    cy.get("button[type='submit']").click();

    cy.url().should("include", "/staff/dashboard");
    cy.pause();
  });

  it("login by member account", () => {
    cy.contains("Login").click();

    cy.get("input[name='email']").type("member@gmail.com");
    cy.get("input[name='password']").type("member123");

    cy.get("button[type='submit']").click();

    cy.url().should("include", "/home");
    cy.pause();
  });
});

