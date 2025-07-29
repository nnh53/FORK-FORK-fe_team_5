import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearAuthData, getUserCookieToken, getUserIdFromCookie, isTokenValid, saveAuthData } from "./auth.utils";
import * as cookieUtils from "./cookie.utils";

// Mock the cookie utilities
vi.mock("./cookie.utils", () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  eraseCookie: vi.fn(),
}));

describe("Auth Utils Testing", () => {
  const mockGetCookie = vi.mocked(cookieUtils.getCookie);
  const mockSetCookie = vi.mocked(cookieUtils.setCookie);
  const mockEraseCookie = vi.mocked(cookieUtils.eraseCookie);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getUserCookieToken", () => {
    it("should return token when access_token cookie exists", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      mockGetCookie.mockReturnValue(mockToken);

      const result = getUserCookieToken();

      expect(mockGetCookie).toHaveBeenCalledWith("access_token");
      expect(result).toBe(mockToken);
    });

    it("should return null when access_token cookie does not exist", () => {
      mockGetCookie.mockReturnValue(null);

      const result = getUserCookieToken();

      expect(mockGetCookie).toHaveBeenCalledWith("access_token");
      expect(result).toBeNull();
    });

    it("should return empty string when cookie is empty", () => {
      mockGetCookie.mockReturnValue("");

      const result = getUserCookieToken();

      expect(result).toBe("");
    });
  });

  describe("getUserIdFromCookie", () => {
    it("should return user ID when user_id cookie exists", () => {
      const mockUserId = "12345";
      mockGetCookie.mockReturnValue(mockUserId);

      const result = getUserIdFromCookie();

      expect(mockGetCookie).toHaveBeenCalledWith("user_id");
      expect(result).toBe(mockUserId);
    });

    it("should return null when user_id cookie does not exist", () => {
      mockGetCookie.mockReturnValue(null);

      const result = getUserIdFromCookie();

      expect(mockGetCookie).toHaveBeenCalledWith("user_id");
      expect(result).toBeNull();
    });
  });

  describe("isTokenValid", () => {
    it("should return true when token exists", () => {
      mockGetCookie.mockReturnValue("valid-token");

      const result = isTokenValid();

      expect(result).toBe(true);
      expect(mockGetCookie).toHaveBeenCalledWith("access_token");
    });

    it("should return false when token is null", () => {
      mockGetCookie.mockReturnValue(null);

      const result = isTokenValid();

      expect(result).toBe(false);
    });

    it("should return false when token is empty string", () => {
      mockGetCookie.mockReturnValue("");

      const result = isTokenValid();

      expect(result).toBe(false);
    });

    it("should return false when token is undefined", () => {
      mockGetCookie.mockReturnValue(undefined as any);

      const result = isTokenValid();

      expect(result).toBe(false);
    });
  });

  describe("saveAuthData", () => {
    it("should save all auth data when all fields are provided", () => {
      const mockAuthData = {
        token: "access-token-123",
        roles: "ADMIN" as const,
        id: "12345",
        fullName: "John Doe",
      };

      saveAuthData(mockAuthData);

      expect(mockSetCookie).toHaveBeenCalledWith("access_token", "access-token-123", 1);
      expect(mockSetCookie).toHaveBeenCalledWith("user_roles", JSON.stringify(["ADMIN"]), 1);
      expect(mockSetCookie).toHaveBeenCalledWith("user_id", "12345", 1);
      expect(mockSetCookie).toHaveBeenCalledWith("fullName", "John Doe", 1);
      expect(mockSetCookie).toHaveBeenCalledTimes(4);
    });

    it("should only save token when only token is provided", () => {
      const mockAuthData = {
        token: "access-token-only",
      };

      saveAuthData(mockAuthData);

      expect(mockSetCookie).toHaveBeenCalledWith("access_token", "access-token-only", 1);
      expect(mockSetCookie).toHaveBeenCalledTimes(1);
    });

    it("should handle roles correctly when provided", () => {
      const mockAuthData = {
        roles: "MEMBER" as const,
      };

      saveAuthData(mockAuthData);

      expect(mockSetCookie).toHaveBeenCalledWith("user_roles", JSON.stringify(["MEMBER"]), 1);
      expect(mockSetCookie).toHaveBeenCalledTimes(1);
    });

    it("should convert number ID to string", () => {
      const mockAuthData = {
        id: "98765",
      };

      saveAuthData(mockAuthData);

      expect(mockSetCookie).toHaveBeenCalledWith("user_id", "98765", 1);
    });

    it("should not save anything when empty object is provided", () => {
      const mockAuthData = {};

      saveAuthData(mockAuthData);

      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it("should handle partial data correctly", () => {
      const mockAuthData = {
        token: "partial-token",
        fullName: "Jane Smith",
        // missing roles and id
      };

      saveAuthData(mockAuthData);

      expect(mockSetCookie).toHaveBeenCalledWith("access_token", "partial-token", 1);
      expect(mockSetCookie).toHaveBeenCalledWith("fullName", "Jane Smith", 1);
      expect(mockSetCookie).toHaveBeenCalledTimes(2);
    });
  });

  describe("clearAuthData", () => {
    it("should clear all auth-related cookies", () => {
      clearAuthData();

      expect(mockEraseCookie).toHaveBeenCalledWith("access_token");
      expect(mockEraseCookie).toHaveBeenCalledWith("refresh_token");
      expect(mockEraseCookie).toHaveBeenCalledWith("user_roles");
      expect(mockEraseCookie).toHaveBeenCalledWith("user_id");
      expect(mockEraseCookie).toHaveBeenCalledWith("fullName");
      expect(mockEraseCookie).toHaveBeenCalledTimes(5);
    });

    it("should call eraseCookie with correct cookie names in correct order", () => {
      clearAuthData();

      const calls = mockEraseCookie.mock.calls;
      expect(calls[0][0]).toBe("access_token");
      expect(calls[1][0]).toBe("refresh_token");
      expect(calls[2][0]).toBe("user_roles");
      expect(calls[3][0]).toBe("user_id");
      expect(calls[4][0]).toBe("fullName");
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete login flow", () => {
      // Simulate complete login
      const authData = {
        token: "login-token",
        roles: "ADMIN" as const,
        id: "1001",
        fullName: "Admin User",
      };

      // Save auth data
      saveAuthData(authData);

      // Verify all cookies are set
      expect(mockSetCookie).toHaveBeenCalledTimes(4);

      // Mock getting token back
      mockGetCookie.mockReturnValue("login-token");

      // Verify token is valid
      expect(isTokenValid()).toBe(true);
      expect(getUserCookieToken()).toBe("login-token");
    });

    it("should handle logout flow", () => {
      // Simulate logout
      clearAuthData();

      // Verify all cookies are cleared
      expect(mockEraseCookie).toHaveBeenCalledTimes(5);

      // Mock empty cookies after logout
      mockGetCookie.mockReturnValue(null);

      // Verify no valid token
      expect(isTokenValid()).toBe(false);
      expect(getUserCookieToken()).toBeNull();
    });

    it("should handle token expiration scenario", () => {
      // Initially valid token
      mockGetCookie.mockReturnValue("valid-token");
      expect(isTokenValid()).toBe(true);

      // Token expires (becomes null)
      mockGetCookie.mockReturnValue(null);
      expect(isTokenValid()).toBe(false);

      // Clear expired auth data
      clearAuthData();
      expect(mockEraseCookie).toHaveBeenCalledTimes(5);
    });
  });
});
