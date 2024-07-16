import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import Navbar from "./Navbar";
import { MemoryRouter } from "react-router-dom";

test('renders navbar h1 brand title', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
    const brandText = screen.getByText(/VisionVault/);
    expect(brandText).toBeInTheDocument();
});

test('renders navbar home link', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
    const homeLink = screen.getByText(/Home/);
    expect(homeLink).toBeInTheDocument();
});

test('renders navbar add product link', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );
    const addLink = screen.getByText(/Add Product/);
    expect(addLink).toBeInTheDocument();
});