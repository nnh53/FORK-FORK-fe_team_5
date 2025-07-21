import { Button } from "./button";

describe("Button", () => {
  it("should mount", () => {
    cy.mount(<Button>Nhấp tôi đi</Button>);
    cy.get("button").contains("Nhấp tôi đi");
  });

  it("when button is clicked, should call onClick", () => {
    cy.mount(<Button onClick={cy.spy().as("onClick")}>Nhấp tôi đi</Button>);
    cy.get("button").contains("Nhấp tôi đi").click();
    cy.get("@onClick").should("have.been.called");
  });
});
