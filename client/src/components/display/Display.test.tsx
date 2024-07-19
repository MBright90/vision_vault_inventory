import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import Display from "./Display";

import type { genre_type } from "@custom_types/types"

jest.mock('@components/productDisplay/ProductDisplay', () => ({
    __esModule: true,
    default: (props: { genreId: string }) => {
      return (
        <div data-testid="mock-product-display">
          mock-product-display - Genre ID: {props.genreId}
        </div>
      );
    }
  }));

beforeAll(async () => {
    global.fetch = jest.fn((): Promise<Response> =>
        Promise.resolve({
            ok: true,
            json: async (): Promise<genre_type[]> => Promise.resolve(
                [{
                    _id: 'test1',
                    __v: 0,
                    name: 'test1',
                    products: ['test1product1'],
                }, {
                    _id: 'test2',
                    __v: 0,
                    name: 'test2',
                    products: ['test2product1', 'test2product2'],
                }, {
                    _id: 'test3',
                    __v: 0,
                    name: 'test3',
                    products: ['test3product1', 'test3product2', 'test3product3'],
                }, {
                    _id: 'test4',
                    __v: 0,
                    name: 'test4',
                    products: [],
                }]
            )
        } as Response)
    );
});

test('verify mock-product-display component is rendered', () => {
    render(<Display />);
    waitFor(() => {
        expect(screen.getByTestId("mock-product-display")).toBeInTheDocument();
    });
})

test('matches snapshot', async () => {
    const { container } = render(<Display />);

    await waitFor(() => {
        expect(container).toMatchSnapshot();
    });
});

test('correctly creates and renders nodes based on genreSelection', async () => {
    render(<Display />);

    await waitFor(() => {
        const genreButtons = screen.getAllByRole('button');
        expect(genreButtons.length).toBe(4);

        expect(screen.getByText(/All/i)).toBeInTheDocument();
        expect(screen.getByText(/Test1/)).toBeInTheDocument();
        expect(screen.getByText(/Test2/i)).toBeInTheDocument();
        expect(screen.getByText(/Test3/i)).toBeInTheDocument();
    });
});

test('displays amount of products within each genre', async () => {
    render(<Display />);

    await waitFor(() => {
        const testGenreOne = screen.getByText(/Test1 \(1\)/);
        expect(testGenreOne).toBeInTheDocument();
        
        const testGenreTwo = screen.getByText(/Test2 \(2\)/);
        expect(testGenreTwo).toBeInTheDocument();

        const testGenreThree = screen.getByText(/Test3 \(3\)/);
        expect(testGenreThree).toBeInTheDocument();
    });
});

test('does not display genres which contain no products', async () => {
    render(<Display />);

    await waitFor(() => {
        expect(screen.queryByText(/Test4 \(4\)/)).toBeNull();
    });
});

test('Initially selects all genre on component mounting', async () => {
    render(<Display />);

    await waitFor(() => {
        expect(screen.getByTestId('currently-selected')).toHaveTextContent('All (6)');
    });
});

test('updates selected genre on click', async () => {
    render(<Display />);

    await waitFor(() => {
        const initialSelectedGenre = screen.getByTestId('currently-selected');
        expect(initialSelectedGenre).toHaveTextContent('All (6)');

        const testGenreOne = screen.getByText(/Test1/);
        fireEvent.click(testGenreOne);

        const newlySelectedGenre = screen.getByTestId('currently-selected');
        expect(newlySelectedGenre).toHaveTextContent('test1 (1)');

        const testGenreThree = screen.getByText(/Test3/);
        fireEvent.click(testGenreThree);

        const finalSelectedGenre = screen.getByTestId('currently-selected');
        expect(finalSelectedGenre).toHaveTextContent('test3 (3)');
    });
});

test('handles component unmounting without errors', () => {
    const { unmount } = render(<Display />);

    expect(() => unmount()).not.toThrow();
});
