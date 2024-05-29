import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import style from './AuthModal.module.scss';

interface AuthModalProps {
    closeModal: () => void,
    callback: (() => void) | (() => Promise<void>)
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal, callback }) => {
    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                <button className={style.closeModal} onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
                <p>Enter admin password to confirm:</p>
                <input className={style.passwordInput}/>
                <button className={style.confirmButton} onClick={() => { void callback(); closeModal(); }}>
                    Confirm
                </button>
            </div>
        </div>
    );
};

module.exports = AuthModal;