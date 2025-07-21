import { SelectField } from "./SelectField";

describe("SelectField", () => {
  const mockOptions = [
    { value: "option1", label: "Tùy chọn 1" },
    { value: "option2", label: "Tùy chọn 2" },
    { value: "option3", label: "Tùy chọn 3" },
  ];

  it("should mount", () => {
    cy.mount(<SelectField label="Test Select" value="" onChange={() => {}} disabled={false} options={mockOptions} />);
    cy.get("label").contains("Test Select");
    cy.get('[role="combobox"]').should("exist");
  });

  it("should display label correctly", () => {
    cy.mount(<SelectField label="Chọn một tùy chọn" value="" onChange={() => {}} disabled={false} options={mockOptions} />);
    cy.get("label").should("contain.text", "Chọn một tùy chọn");
  });

  it("should display placeholder when no value selected", () => {
    cy.mount(
      <SelectField label="Test Select" value="" onChange={() => {}} disabled={false} options={mockOptions} placeholder="Chọn một tùy chọn..." />,
    );
    cy.get('[role="combobox"]').click();
    cy.get('[role="combobox"]').should("contain.attr", "data-placeholder");
  });

  it("should display selected value", () => {
    cy.mount(<SelectField label="Test Select" value="option2" onChange={() => {}} disabled={false} options={mockOptions} />);
    cy.get('[role="combobox"]').should("contain.text", "Tùy chọn 2");
  });

  it("when option is selected, should call onChange", () => {
    cy.mount(<SelectField label="Test Select" value="" onChange={cy.spy().as("onChange")} disabled={false} options={mockOptions} />);

    // Click to open dropdown
    cy.get('[role="combobox"]').click();

    // Click on first option
    cy.get('[role="option"]').first().click();

    // Verify onChange was called
    cy.get("@onChange").should("have.been.called");
  });

  it("should be disabled when disabled prop is true", () => {
    cy.mount(<SelectField label="Test Select" value="" onChange={() => {}} disabled={true} options={mockOptions} />);
    cy.get('[role="combobox"]').should("have.attr", "data-disabled");
  });

  it("should render all options when opened", () => {
    cy.mount(<SelectField label="Test Select" value="" onChange={() => {}} disabled={false} options={mockOptions} />);

    // Open dropdown
    cy.get('[role="combobox"]').click();

    // Check all options are rendered
    cy.get('[role="option"]').should("have.length", 3);
    cy.get('[role="option"]').eq(0).should("contain.text", "Tùy chọn 1");
    cy.get('[role="option"]').eq(1).should("contain.text", "Tùy chọn 2");
    cy.get('[role="option"]').eq(2).should("contain.text", "Tùy chọn 3");
  });

  it("should render with icon when provided", () => {
    const icon = <span data-testid="test-icon">🎯</span>;

    cy.mount(<SelectField label="Test Select" value="" onChange={() => {}} disabled={false} options={mockOptions} icon={icon} />);

    cy.get('[data-testid="test-icon"]').should("exist");
    cy.get("label").should("have.class", "flex");
  });
});
