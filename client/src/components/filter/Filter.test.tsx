import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filter from "./Filter";

const mockGoBack = jest.fn();
const mockUpdateFilter = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
                { _id: 'type1', name: 'type one' },
                { _id: 'type2', name: 'type two' },
            ]),
        })
    ) as jest.Mock;
});

test('matches snapshot', async () => {
    const { container } = render(
        <Filter goBack={mockGoBack} productIsActive={false} updateFilter={mockUpdateFilter}/>
    );

    await waitFor(() => {
        expect(container).toMatchSnapshot();
    });
});

test('go back button is visible when product is active', async () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    await waitFor(() => {
        expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
    });
});

test('go back button not visible when no product is active', async () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={false} updateFilter={mockUpdateFilter}/>
    );

    await waitFor(() => {
        expect(screen.queryByText(/Go Back/i)).not.toBeInTheDocument();
    });
});

test('calls goBack when go back button fires click event', async () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    const goBackBtn = screen.getByText(/Go Back/i);
    fireEvent.click(goBackBtn);

    await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalled();
    });
});

test('renders default filter option correctly', async () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('all');

    await waitFor(() => {
        expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    });
});

test('renders option tags for fetched filters', async () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    await waitFor(() => {
        expect(screen.getByText(/Type One/i)).toBeInTheDocument();
        expect(screen.getByText(/Type Two/i)).toBeInTheDocument();
    });
});

test('changes value of select when new value is posed', async () => {
    render(
        <Filter goBack={mockGoBack} productIsActive={true} updateFilter={mockUpdateFilter}/>
    );

    await waitFor(() => {
        expect(screen.getByText(/Type One/i)).toBeInTheDocument();
    });

    const selectElement = screen.getByTestId('filter-select');
    fireEvent.change(selectElement, { target: { value: 'type one' } });

    await waitFor(() => {
        expect(selectElement).toHaveValue('type one');
    });

});