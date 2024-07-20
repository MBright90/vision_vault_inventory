import React from "react";

interface ConfirmModalMockProps {
    children: React.ReactNode[]
    closeModal: () => {}
}

const ConfirmModalMock: React.FC<ConfirmModalMockProps> = ({ children, closeModal }) => {
    return (
        <div data-testid="mock-confirm-modal" onClick={closeModal}>
            {children}
        </div>
    );
};

export default ConfirmModalMock;