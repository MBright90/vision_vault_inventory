import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import comparePassword from "@utilities/comparePassword";

import style from './AuthModal.module.scss';
import endpoint from "@utilities/endpoint";

export interface ReqOptions {
    method: "DELETE" | "PUT"
    headers: {'Content-Type': string}
    body: string
}

interface AuthModalProps {
    closeModal: () => void
    reqOptions: ReqOptions
    productId: string
    displayModalFunc: (message: string) => void
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal, reqOptions, productId, displayModalFunc }) => {
    const [currentPassword, setCurrentPassword] = useState<string>('');

    async function confirmFunc(): Promise<void> {
        try {
            // check password validity
            const passwordBool = await comparePassword(currentPassword);
            if (reqOptions.method === 'PUT' && passwordBool) {
                const response = await fetch(`${endpoint}/products/edit/${productId}`, reqOptions);
                if (response.ok) {
                    displayModalFunc('Product edited successfully'); // unsuccessful message
                } else {
                    displayModalFunc('Product edit unsuccessful'); // unsuccessful message
                }
            } else if (passwordBool) {
                const response = await fetch(`${endpoint}/products/delete/${productId}`, reqOptions);
                if (response.ok) {
                    displayModalFunc('Product deleted successfully'); // success message
                } else {
                    displayModalFunc('Product delete unsuccessful'); // unsuccessful message
                }
            } else {
                displayModalFunc('Incorrect password'); // incorrect message
            }
        } catch(err) {
            displayModalFunc('Error: Please try again later'); // error message
        }
    }

    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                <button className={style.closeModal} onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
                <label htmlFor='password-input'>Enter admin password to confirm:</label>
                <input 
                    autoFocus
                    id='password-input'
                    name='password-input'
                    type='password'
                    className={style.passwordInput}
                    onChange={(e) => { setCurrentPassword(e.target.value); }}/>
                <div className={style.buttonsContainer}>
                    <button className={style.modalButton} onClick={() => { void confirmFunc(); }}>
                        Confirm
                    </button>
                    <button className={style.modalButton} onClick={() => { closeModal(); }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;