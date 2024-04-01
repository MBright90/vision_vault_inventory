import React from "react";

import style from './Modal.module.scss';

interface ModalProps {
    children: React.ReactNode
    closeModal: () => void
}

const Modal: React.FC<ModalProps> = ({ children, closeModal }) => {
    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                {children}
                <button onClick={closeModal} >X</button>
            </div>
        </div>
    );
};

export default Modal;
