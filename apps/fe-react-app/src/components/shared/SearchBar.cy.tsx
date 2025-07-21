import { SearchBar } from "./SearchBar";

describe("<SearchBar />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    cy.mount(<SearchBar searchOptions={[]} onSearchChange={() => {}} />);
  });
});
