import { Navbar } from "./feature/views/sections/navbar";

describe("<Navbar />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Navbar />);
  });
});
