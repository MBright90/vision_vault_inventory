import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import EditProductForm from "./EditProductForm"

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ReqOptions } from "@components/modals/authModal/AuthModal";
import retrieveTypes from "@utilities/retrieveTypes";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

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

jest.mock('@components/modals/authModal/AuthModal', () => ({
    __esModule: true,
    default: (props: { closeModal: () => {}, reqOptions: ReqOptions, productId: string, displayModalFunc: (message: string) => {} }) => {
        return (
            <div data-testid="mock-auth-modal">
                {props.reqOptions.body}
            </div>
        )
    }
}));

jest.mock('@utilities/retrieveTypes', () => jest.fn());

beforeEach(() => {
    jest.resetAllMocks();

    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: true,
            json: async () => ({
                _id: 'test-id',
                name: 'test-name',
                description: 'test-description',
                price: 1,
                number_in_stock: 2,
                type: { name: 'test-type-name' },
                genres: [
                    { name: 'test-genre-1', _id: 'test-genre-id-1' },
                    { name: 'test-genre-2', _id: 'test-genre-id-2' },
                ],
            }),
        } as Response)
    );
});


test('matches snapshot', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    const { container } = render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(container).toMatchSnapshot();
    });
});

test('calls retrieveTypes on component mount', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(retrieveTypes).toHaveBeenCalledTimes(1);
    });
});

test('renders form with product info values in inputs', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByLabelText(/Product Name/i)).toHaveValue('test-name');
        expect(screen.getByLabelText(/Description/i)).toHaveValue('test-description');
        expect(screen.getByLabelText(/Price/i)).toHaveValue(1);
        expect(screen.getByLabelText(/Current stock/i)).toHaveValue(2);
        expect(screen.getByLabelText(/Type/i)).toHaveValue('Select Type...');
        expect(screen.getByLabelText(/Genres/i)).toHaveValue('test-genre-1, test-genre-2');
    });
});

test('updates the product name input value when typed into', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );
    
    const nameInput = screen.getByLabelText(/Product Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Product Name' } });
    await waitFor(() => {
        expect(nameInput).toHaveValue('Test Product Name');
    });
});

test('updates the product description input value when typed into', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test Product Description' } });
    await waitFor(() => {
        expect(descriptionInput).toHaveValue('Test Product Description');
    });
});

test('updates the product price input value when typed into', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const priceInput = screen.getByLabelText(/Price/i);
    fireEvent.change(priceInput, { target: { value: '100' } });
    await waitFor(() => {
        expect(priceInput).toHaveValue(100);
    });
});

test('updates the product initial stock input value when typed into', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const stockInput = screen.getByLabelText(/Price/i);
    fireEvent.change(stockInput, { target: { value: '200' } });
    await waitFor(() => {
        expect(stockInput).toHaveValue(200);
    });
});

test('updates the product genres input value when typed into', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const genresInput = screen.getByLabelText(/Genres/i);
    fireEvent.change(genresInput, { target: { value: 'Test Genre One, Test Genre Two'} });
    await waitFor(() => {
        expect(genresInput).toHaveValue('Test Genre One, Test Genre Two');
    });
});

test('AuthModal is displayed when form submitted with valid test-id', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const submitBtn = screen.getByText(/^Update product/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(screen.getByTestId('mock-auth-modal')).toBeInTheDocument();
    });
});

test('ConfirmModal is displayed when form submitted with undefined productId', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: undefined });

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const submitBtn = screen.getByText(/^Update product/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(screen.getByTestId('mock-confirm-modal')).toBeInTheDocument();
    });
});

test('ConfirmModal is displayed if error retrieving product on component mount', async () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    global.fetch = jest.fn((): Promise<Response> =>
        Promise.resolve({
            ok: false,
        } as Response)
    );

    render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    const submitBtn = screen.getByText(/^Update product/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(screen.getByTestId('mock-confirm-modal')).toBeInTheDocument();
        expect(screen.getByText(/Error retrieving product/i)).toBeInTheDocument();
    });
});


test('handles component unmounting without errors', () => {
    (require('react-router-dom').useParams as jest.Mock).mockReturnValue({ productId: 'test-id' });

    const { unmount } = render(
        <MemoryRouter initialEntries={['/edit/test-id']}>
            <Routes>
                <Route path="/edit/:productId" element={<EditProductForm />}>
                </Route>
            </Routes>
        </MemoryRouter>
    );

    expect(() => unmount()).not.toThrow();
});