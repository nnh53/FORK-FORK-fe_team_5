import { getGreeting } from "../../test/src/support/app.po.ts";

describe("@newnx/fe-react-app-e2e", () => {
  beforeEach(() => cy.visit("/"));

  it("should display welcome message", () => {
    // Custom command example, see `../support/commands.ts` file
    cy.login("my-email@something.com", "myPassword");

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains(/Welcome/);

    cy.contains("Login").click();

    cy.get("Email").type("admin1@fcinema.com");
    cy.get("Email").should("have.value", "admin1@fcinema.com");

    cy.contains("Password").type("123123123");
    cy.contains("Password").should("have.value", "123123123");
  });
});
