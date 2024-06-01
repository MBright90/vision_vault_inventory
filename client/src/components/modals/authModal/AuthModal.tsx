import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import style from './AuthModal.module.scss';
import endpoint from "@utilities/endpoint";

interface AuthModalProps {
    closeModal: () => void,
    reqOptions: { 
        method: "DELETE" | "POST",
        headers: {'Content-Type': string},
        body: string
    }
    productId: string
    displayModalFunc: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal, reqOptions, productId, displayModalFunc }) => {
    const [currentPassword, setCurrentPassword] = useState<string>('');

    async function confirmFunc(): Promise<void> {
        if (reqOptions.method === 'POST') {
            const response = await fetch(`${endpoint}/edit/${productId}}`);
        } else if (reqOptions.method === 'DELETE') {
            const response = await fetch(`${endpoint}/delete/${productId}`);
        }
        console.log('confirm');
    }

    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                <button className={style.closeModal} onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
                <p>Enter admin password to confirm:</p>
                <input 
                    className={style.passwordInput}
                    onChange={(e) => setCurrentPassword(e.target.value)}/>
                <div className={style.buttonsContainer}>
                    <button className={style.ModalButton} onClick={() => { void confirmFunc(); }}>
                        Confirm
                    </button>
                    <button className={style.ModalButton} onClick={() => { closeModal(); }}>
                        Cancel
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default AuthModal;