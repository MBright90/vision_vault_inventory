import React from "react";

import style from './Modal.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    children: React.ReactNode
    closeModal: () => void
}

const Modal: React.FC<ModalProps> = ({ children, closeModal }) => {
    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                {children}
                <button onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
            </div>
        </div>
    );
};

export default Modal;
