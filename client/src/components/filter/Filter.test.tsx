import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filter from "./Filter";

jest.mock('@utilities/retrieveTypes');

const mockGoBack = jest.fn();
const mockUpdateFilter = jest.fn();

test('matches snapshot', () => {
    const { container } = render(
        <Filter goBack={mockGoBack} productIsActive={false} updateFilter={mockUpdateFilter}/>
    );

    expect(container).toMatchSnapshot();
});