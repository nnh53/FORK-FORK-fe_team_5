import { StaffSidebar } from "./components/Shadcn/staff-sidebar";

describe("<StaffSidebar />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<StaffSidebar />);
  });
});
