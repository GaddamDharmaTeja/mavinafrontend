import { render, screen } from "@testing-library/react";
import App from "./App";
test("renders the storefront navigation", () => { render(<App />); expect(screen.getByRole("link", { name: /maviina mane/i })).toBeInTheDocument(); });
