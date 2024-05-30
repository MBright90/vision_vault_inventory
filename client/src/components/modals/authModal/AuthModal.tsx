import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import style from './AuthModal.module.scss';

interface AuthModalProps {
    closeModal: () => void,
    reqOptions: { 
        method: "DELETE" | "POST",
        headers: {'Content-Type': string},
        body: string
    }
    displayModalFunc: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal, reqOptions, displayModalFunc }) => {
    const [currentPassword, setCurrentPassword] = useState<string>('')

    async function completeFunc() => {
        console.log('confirm')
    }

    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                <button className={style.closeModal} onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
                <p>Enter admin password to confirm:</p>
                <input 
                    className={style.passwordInput}
                    onChange={setCurrentPassword('hello')}/>
                <div className={style.buttonsContainer}>
                    <button className={style.ModalButton} onClick={() => { void callback(); closeModal(); }}>
                        Confirm
                    </button>
                    <button className={style.ModalButton} onClick={() => { void callback(); closeModal(); }}>
                        Cancel
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default AuthModal;