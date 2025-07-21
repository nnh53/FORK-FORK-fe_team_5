describe("template spec", () => {
  it("clicking on login page", () => {
    cy.visit("https://fcinema.pages.dev");

    cy.contains("Login").click();
    cy.url().should("include", "/auth/login");

    cy.contains("Email").type("fake@email.com");
    cy.get("Email").should("have.value", "fake@email.com");
  });
});
