import { Input } from "@/components/Shadcn/ui/input";

describe("<Input />", () => {
  it("renders", () => {
    cy.mount(<Input />);
    cy.get('input[data-slot="input"]').should("exist");
  });

  it("calls onChange with the correct value when text is typed", () => {
    const handleChange = cy.spy().as("handleChangeSpy");

    cy.mount(<Input onChange={handleChange} />);

    const testValue = "Hello, Cypress!";

    cy.get('input[data-slot="input"]').type(testValue);

    cy.get("@handleChangeSpy").then((spy) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(spy).to.have.been.called;

      const spyCall = (spy as any).lastCall;
      const eventArg = spyCall.args[0];

      expect(eventArg.target.value).to.eq(testValue);
    });
  });
});
