/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
const loginAsMember = () => {
  cy.contains("Login").click();
  cy.get("input[name='email']").type("member@gmail.com");
  cy.get("input[name='password']").type("member123");
  cy.get("button[type='submit']").click();
  cy.url().should("include", "/home");
};

describe("Carousel Testing", () => {
  beforeEach(() => {
    cy.visit("/");
    loginAsMember();
  });
  it("Clicking", () => {
    cy.wait(200);
    cy.get('[data-slot="carousel-next"]').should("be.visible");
    cy.get('[data-slot="carousel-previous"]').should("be.visible");

    cy.get('[data-slot="carousel-next"]').click();
    cy.wait(500);
    cy.get('[data-slot="carousel-next"]').click();
    cy.wait(500);

    cy.get('[data-slot="carousel-previous"]').click();
    cy.wait(500);
    cy.get('[data-slot="carousel-previous"]').click();
    cy.wait(500);

    cy.get('[data-slot="carousel-next"]').should("not.be.disabled");
    cy.get('[data-slot="carousel-previous"]').should("not.be.disabled");
    cy.get('button[aria-label="Go to slide 3"]').click().wait(500);
    cy.get('button[aria-label="Go to slide 5"]').click().wait(500);
    cy.get('button[aria-label="Go to slide 1"]').click().wait(500);
    cy.get('button[aria-label="Go to slide 2"]').click().wait(500);

    cy.contains("Home").dblclick().wait(500);
  });

  it("See movie detail", () => {
    cy.contains("Book Tickets").click().wait(500);
    cy.contains("Đạo diễn").should("be.visible");
  });
});
