/* eslint-disable @typescript-eslint/no-explicit-any */

import { Filter, type FilterCriteria } from "./Filter";

const simpleFilterOptions = [
  {
    value: "role",
    label: "Role",
    type: "select" as const,
    selectOptions: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
  },
];

describe("<Filter />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Filter
        filterOptions={[]}
        onFilterChange={() => {
          console.log("");
        }}
      />,
    );
    // Basic assertion: filter trigger button should be present
    cy.get("button").should("exist");
  });
});

describe("<Filter /> interactions", () => {
  it("allows selecting a value and applies the filter", () => {
    const onFilterChange = cy.spy().as("onFilterChange");

    cy.mount(<Filter filterOptions={simpleFilterOptions} onFilterChange={onFilterChange} />);

    // Open the popover (first filter button on screen)
    cy.get("button").first().click({ force: true });

    // Open the select dropdown
    cy.contains("Chọn role").click({ force: true });

    // Choose the "Admin" option
    cy.contains("Admin").click({ force: true });

    // Apply
    cy.contains("Áp dụng").click({ force: true });

    // Expect callback called with correct payload
    cy.get("@onFilterChange").should("have.been.calledOnce");

    cy.get("@onFilterChange").then((spy) => {
      const mySpy = spy as any;
      const arg = mySpy.args[0][0] as FilterCriteria[];
      expect(arg).to.have.length(1);
      expect(arg[0]).to.include({ field: "role", value: "admin" });
    });
  });

  it("clears applied filters when 'Xóa bộ lọc' is clicked", () => {
    const onFilterChange = cy.spy().as("onFilterChange");

    cy.mount(<Filter filterOptions={simpleFilterOptions} onFilterChange={onFilterChange} />);

    // Apply a filter first (reuse helper above)
    cy.get("button").first().click({ force: true });
    cy.contains("Chọn role").click({ force: true });
    cy.contains("Admin").click({ force: true });
    cy.contains("Áp dụng").click({ force: true });

    // Now clear filters
    cy.contains("Xóa bộ lọc").click({ force: true });

    // Callback should get empty array
    cy.get("@onFilterChange").then((spy) => {
      const mySpy = spy as any;
      // It should have been called twice: one for apply, one for clear
      expect(mySpy.callCount).to.eq(2);
      const secondArg = mySpy.args[1][0] as FilterCriteria[];
      expect(secondArg).to.have.length(0);
    });
  });
});
