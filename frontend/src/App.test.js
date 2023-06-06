import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import SeatingApi from "./api";
import UserContext from "./auth/UserContext";

// Mock the SeatingApi module
jest.mock("./api");

describe("App", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renders navigation and app router components", async () => {
    const mockCurrentUser = { id: 1, username: "testuser" };
    SeatingApi.getCurrentUser.mockResolvedValue(mockCurrentUser);

    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  test("sets currentUser in UserContext if token is present", async () => {
    const mockCurrentUser = { id: 1, username: "testuser" };
    SeatingApi.getCurrentUser.mockResolvedValue(mockCurrentUser);

    localStorage.setItem("seating-token", "testtoken");

    render(
      <BrowserRouter>
        <UserContext.Provider value={{}}>
          <App />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    );

    expect(UserContext.currentUser).toBe(mockCurrentUser);
  });

  test("removes currentUser from UserContext when token is removed", async () => {
    const mockCurrentUser = { id: 1, username: "testuser" };
    SeatingApi.getCurrentUser.mockResolvedValue(mockCurrentUser);

    localStorage.setItem("seating-token", "testtoken");

    const { rerender } = render(
      <BrowserRouter>
        <UserContext.Provider value={{}}>
          <App />
        </UserContext.Provider>
      </BrowserRouter>
    );


    localStorage.removeItem("seating-token");

    rerender(
      <BrowserRouter>
        <UserContext.Provider value={{}}>
          <App />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(UserContext.currentUser).toBe(null);
  });
});
