import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import Display from "./Display";

import type { genre_type } from "@custom_types/types"

beforeAll(async () => {
    global.fetch = jest.fn((): Promise<Response> =>
        Promise.resolve({
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

test('matches snapshot', () => {
    const { container } = render(<Display />);

    expect(container).toMatchSnapshot();
});

test('displays retrieved genres', () => {
    render(<Display />);

    const testGenreOne = screen.getByText(/test1/);
    expect(testGenreOne).toBeInTheDocument();
    
    const testGenreTwo = screen.getByText(/test2/);
    expect(testGenreTwo).toBeInTheDocument();

    const testGenreThree = screen.getByText(/test3/);
    expect(testGenreThree).toBeInTheDocument();
});

test('displays amount of products within each genre', () => {
    render(<Display />);

    const testGenreOne = screen.getByText(/test1 \(1\)/);
    expect(testGenreOne).toBeInTheDocument();
    
    const testGenreTwo = screen.getByText(/test2 \(2\)/);
    expect(testGenreTwo).toBeInTheDocument();

    const testGenreThree = screen.getByText(/test3 \(3\)/);
    expect(testGenreThree).toBeInTheDocument();
});

test('does not display genres which contain no products', () => {
    render(<Display />);

    const testGenreFour = screen.getByText(/test4 \(4\)/);
    expect(testGenreFour).toBeUndefined();
});