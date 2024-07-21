import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import NewProductForm from "./NewProductForm";

import retrieveTypes from "@utilities/retrieveTypes";

jest.mock('@components/modals/confirmModal/ConfirmModal', () => ({
    __esModule: true,
    default: (props: { children: React.ReactNode[], closeModal: () => {} }) => {
        return (
            <div data-testid="mock-confirm-modal">
                {props.children}
            </div>
        )
    }
}));

jest.mock('@utilities/retrieveTypes', () => jest.fn());

beforeAll(async () => {
    global.fetch = jest.fn();
});

beforeEach(() => {
    jest.resetAllMocks();
});

test('matches snapshot', () => {
    const { container } = render(<NewProductForm />);
    
    expect(container).toMatchSnapshot();
});

test('calls retrieveTypes on component mount', () => {
    render(<NewProductForm />);

    expect(retrieveTypes).toHaveBeenCalledTimes(1);
});

test('renders form with initial empty values', () => {
    render(<NewProductForm />);

    expect(screen.getByLabelText(/Product Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    expect(screen.getByLabelText(/Price/i)).toHaveValue(0);
    expect(screen.getByLabelText(/Initial Stock/i)).toHaveValue(0);
    expect(screen.getByLabelText(/Type/i)).toHaveValue('Select Type...');
    expect(screen.getByLabelText(/Genres/i)).toHaveValue('');
});

test('updates the product name input value when typed into', () => {
    render(<NewProductForm />);
    
    const nameInput = screen.getByLabelText(/Product Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Product Name' } });
    expect(nameInput).toHaveValue('Test Product Name');
});

test('updates the product description input value when typed into', () => {
    render(<NewProductForm />);

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test Product Description' } });
    expect(descriptionInput).toHaveValue('Test Product Description');
});

test('updates the product price input value when typed into', () => {
    render(<NewProductForm />)

    const priceInput = screen.getByLabelText(/Price/i);
    fireEvent.change(priceInput, { target: { value: '100' } });
    expect(priceInput).toHaveValue(100);
});

test('updates the product initial stock input value when typed into', () => {
    render(<NewProductForm />)

    const stockInput = screen.getByLabelText(/Price/i);
    fireEvent.change(stockInput, { target: { value: '200' } });
    expect(stockInput).toHaveValue(200);
});

test('updates the product genres input value when typed into', () => {
    render(<NewProductForm />)

    const genresInput = screen.getByLabelText(/Genres/i);
    fireEvent.change(genresInput, { target: { value: 'test genre one, test genre two'} });
    expect(genresInput).toHaveValue('test genre one, test genre two');
});

test('form is submitted when submit button is clicked', async () => {
    render(<NewProductForm />);

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
    });
});

test('upon successful form submission, a modal shows success message', async () => {
    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: true,
            json: async () => {},
        } as Response)
    );
    
    render(<NewProductForm />);

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    expect(fetch).toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByTestId('mock-confirm-modal')).toBeInTheDocument();
        expect(screen.getByText('Product added successfully')).toBeInTheDocument();
    });
});

test('upon unsuccessful form submission, a modal shows an error message', async () => {
    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: false,
            json: async (): Promise<{ err: string }> => Promise.resolve({
                err: 'test error message'
            }),
        } as Response)
    );
    
    render(<NewProductForm />);

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    expect(fetch).toHaveBeenCalled();

    await waitFor(() => {
        expect(screen.getByTestId('mock-confirm-modal')).toBeInTheDocument();
        expect(screen.getByText(/Error adding product/i)).toBeInTheDocument();
        expect(screen.getByText(/test error message/i)).toBeInTheDocument();
    });
});

test('handles component unmounting without errors', () => {
    const { unmount } = render(<NewProductForm />);

    expect(() => unmount()).not.toThrow();
});
