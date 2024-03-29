import React from "react";

import style from './Modal.module.scss';

interface ModalProps {
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ children }) => {
    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
