import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filter from "./Filter";

jest.mock('@utilities/retrieveTypes');

const mockGoBack = jest.fn();
const mockUpdateFilter = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
});

test('matches snapshot', () => {
    const { container } = render(
        <Filter goBack={mockGoBack} productIsActive={false} updateFilter={mockUpdateFilter}/>
    );

    expect(container).toMatchSnapshot();
});

test('go back button is visible when product is active', () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
});

test('go back button not visible when no product is active', () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={false} updateFilter={mockUpdateFilter}/>
    );

    expect(screen.queryByText(/Go Back/i)).not.toBeInTheDocument();
});

test('calls goBack when go back button fires click event', () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    const goBackBtn = screen.getByText(/Go Back/i);
    fireEvent.click(goBackBtn);

    expect(mockGoBack).toHaveBeenCalled();
});
