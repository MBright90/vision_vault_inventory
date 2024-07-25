import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import ProductDisplay from "./ProductDisplay";

jest.mock('@components/filter/Filter', () => ({
    _esModule: true,
    default: (props: { goBack: () => {}, productIsActive: {}, updateFilter: () => {} }) => {
        return (
            <div data-testid="mock-filter">
                <p>mock-filter</p>
            </div>
        )
    }
}));

jest.mock('@components/filter/Filter', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-filter"></div>,
}));

jest.mock('@components/product/Product', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-product"></div>,
}));

beforeEach(() => {
    jest.resetAllMocks();

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: async () => ([
                {
                    _id: 'test-id-1',
                    name: 'test-name',
                    description: 'test-description',
                    price: 1,
                    number_in_stock: 2,
                    type: { name: 'test-type-name' },
                    genres: [
                        { name: 'test-genre-1', _id: 'test-genre-id-1' },
                        { name: 'test-genre-2', _id: 'test-genre-id-2' },
                    ],
                }, {
                    _id: 'test-id-2',
                    name: 'test-name-2',
                    description: 'test-description-2',
                    price: 10,
                    number_in_stock: 20,
                    type: { name: 'test-type-name' },
                    genres: [
                        { name: 'test-genre-1', _id: 'test-genre-id-1' },
                        { name: 'test-genre-2', _id: 'test-genre-id-2' },
                    ],  
                }
            ]),
        } as Response)
    );
});

test('matches snapshot', async () => {
    const { container } = render(<ProductDisplay genreId="all"/>);

    await waitFor(() => {
        expect(container).toMatchSnapshot();
    });
});

test('displays no products message when no products are retrieved', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: async () => ([]),
    } as Response)
);
    render(<ProductDisplay genreId="all"/>);

    await waitFor(() => {
        expect(screen.getByText(/No products matching search parameters/i)).toBeInTheDocument();
    });
});

test('displays a retrieved products name, description and type', async () => {
    render(<ProductDisplay genreId="all" />);

    await waitFor(() => {
        expect(screen.getByText(/^test-name$/i)).toBeInTheDocument();
        expect(screen.getByText(/^test-description$/i)).toBeInTheDocument();
    });
});