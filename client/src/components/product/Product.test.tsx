import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import Product from "./Product";
import { MemoryRouter } from "react-router-dom";
import { product_type } from "@custom_types/types";
import { ReqOptions } from "@components/modals/authModal/AuthModal";

const mockProduct: product_type = {
    _id: 'test-id',
    __v: 0,
    name: 'test-name',
    description: 'test-description',
    price: 10,
    number_in_stock: 100,
    type: { _id: 'test-type-id', name: 'test-type-name' },
    genres: [
        { name: 'test-genre-one', _id: 'test-genre-id-1' },
        { name: 'test-genre-two', _id: 'test-genre-id-2' },
    ],
    stock_last_updated: '2024-06-05T09:09:10.297+00:00',
    last_updated: '2024-06-05T09:09:10.297+00:00',
}

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

test('matches snapshot', () => {
    const { container } = render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
});

test('renders product information correctly', () => {
    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    expect(screen.getByText(/^test-name/i)).toBeInTheDocument();
    expect(screen.getByText(/^test-type-name/i)).toBeInTheDocument();
    expect(screen.getByText(/^test-genre-one, test-genre-two/i)).toBeInTheDocument();
    expect(screen.getByText(/^test-description/i)).toBeInTheDocument();
    expect(screen.getByText(/^£10/i)).toBeInTheDocument();
    expect(screen.getByText(/^In stock: 100/i)).toBeInTheDocument();
});

test('renders update stock button', () => {
    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    expect(screen.getByText(/^Update stock/i)).toBeInTheDocument();
});

test('displays number input and control buttons when updating stock', async () => {
    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const updateStockBtn = screen.getByText(/Update stock/i);
    fireEvent.click(updateStockBtn);

    await waitFor(() => {
        const updateStockInput = screen.getByRole('textbox', { name: 'update-stock' });
        expect(updateStockInput).toBeInTheDocument();
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });
});

test('stock input value updates upon change', async () => {
    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const updateStockBtn = screen.getByText(/Update stock/i);
    fireEvent.click(updateStockBtn);

    await waitFor(() => {
        const updateStockInput = screen.getByRole('textbox', { name: 'update-stock' });
        fireEvent.change(updateStockInput, { target: { value: 20 } });
        expect(updateStockInput).toHaveValue(20);
    });
});

test('updates a positive stock change value', async () => {
    global.fetch = jest.fn();

    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const updateStockBtn = screen.getByText(/Update stock/i);
    fireEvent.click(updateStockBtn);

    await waitFor(() => {
        const updateStockInput = screen.getByRole('textbox', { name: 'update-stock' });
        fireEvent.change(updateStockInput, { target: { value: 20 } });

        const submitBtn = screen.getByText(/Submit/i);
        fireEvent.click(submitBtn);

        expect(screen.getByText(/In stock: 30/i)).toBeInTheDocument();
    });
});

test('updates a positive stock change value', async () => {
    global.fetch = jest.fn();

    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const updateStockBtn = screen.getByText(/Update stock/i);
    fireEvent.click(updateStockBtn);

    await waitFor(() => {
        const updateStockInput = screen.getByRole('textbox', { name: 'update-stock' });
        fireEvent.change(updateStockInput, { target: { value: -5 } });

        const submitBtn = screen.getByText(/Submit/i);
        fireEvent.click(submitBtn);

        expect(screen.getByText(/In stock: 5/i)).toBeInTheDocument();
    });
});

test('displays ConfirmModal with success message on stock update success', async () => {
    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: true,
        } as Response)
    );

    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const updateStockBtn = screen.getByText(/Update stock/i);
    fireEvent.click(updateStockBtn);

    await waitFor(() => {
        const updateStockInput = screen.getByRole('textbox', { name: 'update-stock' });
        fireEvent.change(updateStockInput, { target: { value: 1 } });

        const submitBtn = screen.getByText(/Submit/i);
        fireEvent.click(submitBtn);

        expect(screen.getByTestId('mock-confirm-modal')).toBeInTheDocument();
        expect(screen.getByText(/^Stock updated/i)).toBeInTheDocument();
    });
});

test('displays ConfirmModal with error message on stock update error', async () => {
    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: false,
        } as Response)
    );

    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const updateStockBtn = screen.getByText(/Update stock/i);
    fireEvent.click(updateStockBtn);

    await waitFor(() => {
        const updateStockInput = screen.getByRole('textbox', { name: 'update-stock' });
        fireEvent.change(updateStockInput, { target: { value: 1 } });

        const submitBtn = screen.getByText(/Submit/i);
        fireEvent.click(submitBtn);

        expect(screen.getByTestId('mock-confirm-modal')).toBeInTheDocument();
        expect(screen.getByText(/Error updating stock amount/i)).toBeInTheDocument();
    });
});

test('displays AuthModal when user requests product deletion', async () => {
    render(
        <MemoryRouter>
            <Product product={mockProduct} />
        </MemoryRouter>
    );

    const deleteBtn = screen.getByText(/^Delete/i);
    fireEvent.click(deleteBtn);

    await waitFor(() => {
        expect(screen.getByTestId('mock-auth-modal')).toBeInTheDocument();
    });
});