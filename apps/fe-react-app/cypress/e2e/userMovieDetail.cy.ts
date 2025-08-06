/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
const loginAsMember = () => {
  cy.contains("Login").click();
  cy.get("input[name='email']").type("member@gmail.com");
  cy.get("input[name='password']").type("member123");
  cy.get("button[type='submit']").click();
  cy.url().should("include", "/home");
};
describe("See Movie Detail", () => {
  beforeEach(() => {
    cy.visit("/");
    loginAsMember();
  });

  it("Searching a movie by name", () => {
    cy.wait(1000);
    cy.scrollTo(0, 500);

    cy.get('input[placeholder="Nhập tên phim để tìm kiếm..."]').should("be.visible");
    cy.get('input[placeholder="Nhập tên phim để tìm kiếm..."]').type("Thế Giới Khủng Lo");

    cy.get(".divide-y button").should("be.visible");
    cy.get(".divide-y button").first().click();

    cy.contains("Thế Giới Khủng Long").should("be.visible");
  });

  // it("Choose a movie in Trending", () => {
  //   cy.wait(1000);
  //   cy.scrollTo(0, 2000);
  //   cy.wait(5000);
  //   cy.contains("Best Sellers").should("be.visible");
  //   cy.get('[data-testid="movie-item"]').should("have.length.gt", 0);

  //   // Hover over movies 02, 03, 04 sequentially
  //   const movieNumbers = ["02", "03", "04"];
  //   movieNumbers.forEach((number) => {
  //     cy.get('[data-testid="movie-item"]').contains(number).trigger("mouseenter").wait(500);
  //   });

  //   cy.get('[data-testid="movie-item"]').contains("01").click();
  //   cy.contains("Đạo diễn").should("be.visible");
  // });
});
