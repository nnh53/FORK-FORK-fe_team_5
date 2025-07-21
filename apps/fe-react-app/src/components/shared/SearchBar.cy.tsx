import { SearchBar } from "./SearchBar";

describe("<SearchBar />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SearchBar searchOptions={[]} onSearchChange={() => {}} />);
  });
});
