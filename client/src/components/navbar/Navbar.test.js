import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

test('renders navbar h1 brand title', () => {
    render(<Navbar />);
    const brandText = screen.getByText(/VisionVault/);
    expect(brandText).toBeInTheDocument();
});