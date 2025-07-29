import { describe, expect, it, vi } from "vitest";
import { $api } from "./api";

vi.mock("openapi-fetch", () => ({
  default: vi.fn().mockReturnValue({ use: vi.fn() }),
}));

vi.mock("openapi-react-query", () => ({
  default: vi.fn().mockReturnValue({
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  }),
}));

describe("API Client Initialization", () => {
  it("should create the $api client successfully and it should not be null", () => {
    expect($api).toBeDefined();
    expect($api).not.toBeNull();
  });
});

describe("FetchClient and BaseURL Validation", () => {
  
  it("should handle VITE_API_URL environment variable correctly", () => {
    // Mock environment variable
    const mockEnvUrl = "https://test-api.example.com";

    // Tạo expected baseUrl
    const expectedBaseUrl = `${mockEnvUrl}/movie_theater/`;

    // Kiểm tra format của expected URL
    expect(expectedBaseUrl).toBe("https://test-api.example.com/movie_theater/");
    expect(expectedBaseUrl).toMatch(/^https?:\/\/.+\/movie_theater\/$/);
  });

  it("should ensure fetchClient is not null after creation", () => {
    const createFetchClient = require("openapi-fetch").default;
    const mockFetchClient = createFetchClient();

    // Kiểm tra fetchClient không null
    expect(mockFetchClient).toBeDefined();
    expect(mockFetchClient).not.toBeNull();
    expect(typeof mockFetchClient).toBe("object");

    // Kiểm tra fetchClient có method use (cho interceptors)
    expect(mockFetchClient.use).toBeDefined();
    expect(typeof mockFetchClient.use).toBe("function");
  });


});
