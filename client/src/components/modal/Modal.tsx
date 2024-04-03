import React from "react";

import style from './Modal.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    children: React.ReactNode
    closeModal: () => void
    confirm?: {
        text: string,
        func: () => void
    }
}

const Modal: React.FC<ModalProps> = ({ children, closeModal, confirm = null }) => {
    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                {children}
                <button className={style.closeModal} onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
                { confirm !== null ? 
                    <button className={style.confirmButton} onClick={() => { confirm.func(); closeModal(); }}>
                        {confirm.text}
                    </button>
                :  null }
            </div>
        </div>
    );
};

export default Modal;
