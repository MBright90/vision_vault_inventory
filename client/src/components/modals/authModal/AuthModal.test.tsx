import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import AuthModal, { type ReqOptions } from "./AuthModal"
import comparePassword from "@utilities/comparePassword";

jest.mock('@utilities/comparePassword');

const mockCloseModal = jest.fn();
const mockProductId = 'test-id';
const mockDisplayModalFunc = jest.fn();

const initialReqOptions: ReqOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: "test-body",
};

let mockReqOptions: ReqOptions = { ...initialReqOptions };

beforeEach(() => {
    mockReqOptions = { ...initialReqOptions };
});

beforeAll(() => {
    global.fetch = jest.fn();
});

test('matches snapshot', () => {
    const { container } = render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    expect(container).toMatchSnapshot();
});

test('renders with initial password input value empty', () => {
    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    expect(passwordInput).toHaveValue('');
});

test('updates password input on key events', () => {
    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    fireEvent.change(passwordInput, { target: { value: 'test-password'} });
    expect(passwordInput).toHaveValue('test-password');
});

test('closes modal when X button clicked', () => {
    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const xCloseModalBtn = screen.getAllByRole('button')[0];
    fireEvent.click(xCloseModalBtn);
    expect(mockCloseModal).toHaveBeenCalled();
});

test('closes modal when cancel button clicked', () => {
    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const cancelModalBtn = screen.getByText(/Cancel/i);
    fireEvent.click(cancelModalBtn);
    expect(mockCloseModal).toHaveBeenCalled();
});

test('calls comparePassword when password is submitted', () => {
    (comparePassword as jest.Mock) = jest.fn();

    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const submitBtn = screen.getByText(/^Confirm/i);
    fireEvent.click(submitBtn);

    expect(comparePassword).toHaveBeenCalled();
});

test('displays correct message when password is incorrect', async () => {
    (comparePassword as jest.Mock).mockResolvedValue(false);

    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    fireEvent.change(passwordInput, { target: { value: 'incorrect-password'} });

    const submitBtn = screen.getByText(/^Confirm/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(comparePassword).toHaveBeenCalledWith('incorrect-password');
        expect(mockDisplayModalFunc).toHaveBeenCalledWith('Incorrect password');
    })
});

test('displays correct message when password is correct, reqOptions.method is DELETE and process successful', async () => {
    (comparePassword as jest.Mock).mockResolvedValue(true);
    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: true,
        } as Response)
    );

    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    fireEvent.change(passwordInput, { target: { value: 'correct-password' } });

    const submitBtn = screen.getByText(/^Confirm/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(comparePassword).toHaveBeenCalledWith('correct-password');
        expect(mockDisplayModalFunc).toHaveBeenCalledWith('Product deleted successfully');
    });
});

test('displays correct message when password is correct, reqOptions.method is DELETE and process unsuccessful', async () => {
    (comparePassword as jest.Mock).mockResolvedValue(true);
    global.fetch = jest.fn((): Promise<Response> => 
        Promise.resolve({
            ok: false,
        } as Response)
    );

    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    fireEvent.change(passwordInput, { target: { value: 'correct-password' } });

    const submitBtn = screen.getByText(/^Confirm/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(comparePassword).toHaveBeenCalledWith('correct-password');
        expect(mockDisplayModalFunc).toHaveBeenCalledWith('Product delete unsuccessful');
    });
});

test('displays correct message when password is incorrect, reqOptions.method is PUT and process successful', async () => {
    (comparePassword as jest.Mock).mockResolvedValue(true);
    global.fetch = jest.fn((): Promise<Response> =>
        Promise.resolve({
            ok: true,
        } as Response)
    );

    mockReqOptions.method = "PUT";

    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    fireEvent.change(passwordInput, { target: { value: 'correct-password' } });

    const submitBtn = screen.getByText(/^Confirm/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(comparePassword).toHaveBeenCalledWith('correct-password');
        expect(mockDisplayModalFunc).toHaveBeenCalledWith('Product edited successfully');
    })
});

test('displays correct message when password is correct, reqOptions.method is DELETE and process unsuccessful', async () => {
    (comparePassword as jest.Mock).mockResolvedValue(true);
    global.fetch = jest.fn((): Promise<Response> =>
        Promise.resolve({
            ok: false,
        } as Response)
    );

    mockReqOptions.method = "PUT";

    render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    const passwordInput = screen.getByLabelText(/Enter admin password to confirm:/i);
    fireEvent.change(passwordInput, { target: { value: 'correct-password' } });

    const submitBtn = screen.getByText(/^Confirm/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(comparePassword).toHaveBeenCalledWith('correct-password');
        expect(mockDisplayModalFunc).toHaveBeenCalledWith('Product edit unsuccessful');
    })
});

test('handles component unmounting without errors', () => {
    const { unmount } = render(
        <AuthModal 
            closeModal={mockCloseModal}
            reqOptions={mockReqOptions}
            productId={mockProductId}
            displayModalFunc={mockDisplayModalFunc}
        />
    );

    expect(() => unmount()).not.toThrow();
});