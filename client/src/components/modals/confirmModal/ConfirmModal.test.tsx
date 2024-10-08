import React from "react";
import { screen, render, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import ConfirmModal from "./ConfirmModal"

const mockCloseModal = jest.fn();
const mockConfirm = {
    text: "confirm",
    func: jest.fn(),
};

test('matches snapshot', () => {
    const { container } = render(
        <ConfirmModal closeModal={mockCloseModal} confirm={mockConfirm}>
            <p>confirm message</p>
        </ConfirmModal>
    );

    expect(container).toMatchSnapshot();
});

test('message text component child is displayed', () => {
    render(
        <ConfirmModal closeModal={mockCloseModal} confirm={mockConfirm}>
            <p>confirm message</p>
        </ConfirmModal>
    );

    const confirmMessage = screen.getByText(/confirm message/);
    expect(confirmMessage).toBeInTheDocument();
});

test('confirm text is displayed as confirm button text', () => {
    render(
        <ConfirmModal closeModal={mockCloseModal} confirm={mockConfirm}>
            <p></p>
        </ConfirmModal>
    );

    const confirmButton = screen.getByText(/confirm/);
    expect(confirmButton).toBeInTheDocument();
});

test('closeModal function is called on X click', () => {
    render(
        <ConfirmModal closeModal={mockCloseModal} confirm={mockConfirm}>
            <p></p>
        </ConfirmModal>
    );

    const closeButton = screen.getByTestId(/close button/);
    fireEvent.click(closeButton);
    expect(mockCloseModal).toHaveBeenCalled();
});

test('confirm.func and closeModal are called on confirm button click', () => {
    render(
        <ConfirmModal closeModal={mockCloseModal} confirm={mockConfirm}>
            <p></p>
        </ConfirmModal>
    );

    const confirmButton = screen.getByText(/confirm/);
    fireEvent.click(confirmButton);
    expect(mockConfirm.func).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
});

test('handles component unmounting without errors', () => {
    const { unmount } = render(
        <ConfirmModal closeModal={mockCloseModal} confirm={mockConfirm}>
            <p></p>
        </ConfirmModal>
    );

    expect(() => unmount()).not.toThrow();
});