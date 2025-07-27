import { Input } from "@/components/Shadcn/ui/input";

describe("<Input />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react

    cy.mount(<Input />);
  });
});
