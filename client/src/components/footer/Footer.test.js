import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import Footer from "./Footer";

test('renders link to creators github page', () => {
    render(<Footer />);
    const aLink = screen.getByText(/MBright90/);
    expect(aLink).toBeInTheDocument();
});