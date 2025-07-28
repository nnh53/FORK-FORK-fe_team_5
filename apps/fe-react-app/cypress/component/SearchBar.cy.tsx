import { SearchBar } from "../../src/components/shared/SearchBar";

// Move mockSearchOptions to the top level scope
const mockSearchOptions = [
  { value: "name", label: "Tên" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Số điện thoại" },
];

describe("<SearchBar />", () => {
  it("renders", () => {
    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={cy.stub()} />);

    // Kiểm tra input được render
    cy.get('input[placeholder="Tìm kiếm..."]').should("exist");

    // Kiểm tra icon search tồn tại
    cy.get("svg").should("have.class", "lucide-search");

    // Kiểm tra hiển thị các trường có thể tìm kiếm
    cy.contains("Có thể tìm kiếm theo: Tên, Email, Số điện thoại").should("exist");
  });

  it("calls onSearchChange with correct value when typing", () => {
    const onSearchChangeSpy = cy.spy().as("onSearchChangeSpy");

    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={onSearchChangeSpy} />);

    const searchText = "John Doe";

    cy.get('input[placeholder="Tìm kiếm..."]').type(searchText);

    // Kiểm tra onSearchChange được gọi với đúng giá trị
    cy.get("@onSearchChangeSpy").should("have.been.calledWith", searchText);

    // Kiểm tra input có giá trị đúng
    cy.get('input[placeholder="Tìm kiếm..."]').should("have.value", searchText);
  });

  it("shows clear button when there is text and clears search when clicked", () => {
    const onSearchChangeSpy = cy.spy().as("onSearchChangeSpy");

    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={onSearchChangeSpy} />);

    const searchText = "Test search";

    // Nhập text
    cy.get('input[placeholder="Tìm kiếm..."]').type(searchText);

    // Kiểm tra clear button xuất hiện
    cy.contains("Xóa").should("exist");
    cy.get("svg").should("have.class", "lucide-x");

    // Click vào clear button
    cy.contains("Xóa").click();

    // Kiểm tra input được clear
    cy.get('input[placeholder="Tìm kiếm..."]').should("have.value", "");

    // Kiểm tra onSearchChange được gọi với empty string
    cy.get("@onSearchChangeSpy").should("have.been.calledWith", "");
  });

  it("does not show limited fields info when limitedFields is false", () => {
    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={cy.stub()} limitedFields={false} />);

    cy.contains("Có thể tìm kiếm theo:").should("not.exist");
  });

  it("uses custom placeholder", () => {
    const customPlaceholder = "Nhập từ khóa tìm kiếm...";

    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={cy.stub()} placeholder={customPlaceholder} />);

    cy.get(`input[placeholder="${customPlaceholder}"]`).should("exist");
  });

  it("calls resetPagination when provided and search changes", () => {
    const onSearchChangeSpy = cy.spy().as("onSearchChangeSpy");
    const resetPaginationSpy = cy.spy().as("resetPaginationSpy");

    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={onSearchChangeSpy} resetPagination={resetPaginationSpy} />);

    cy.get('input[placeholder="Tìm kiếm..."]').type("test");

    // Kiểm tra cả onSearchChange và resetPagination được gọi
    cy.get("@onSearchChangeSpy").should("have.been.called");
    cy.get("@resetPaginationSpy").should("have.been.called");
  });

  it("calls resetPagination when provided and clear button is clicked", () => {
    const onSearchChangeSpy = cy.spy().as("onSearchChangeSpy");
    const resetPaginationSpy = cy.spy().as("resetPaginationSpy");

    cy.mount(<SearchBar searchOptions={mockSearchOptions} onSearchChange={onSearchChangeSpy} resetPagination={resetPaginationSpy} />);

    // Nhập text và click clear
    cy.get('input[placeholder="Tìm kiếm..."]').type("test");
    cy.contains("Xóa").click();

    // Kiểm tra resetPagination được gọi khi clear
    cy.get("@resetPaginationSpy").should("have.been.called");
  });
});
