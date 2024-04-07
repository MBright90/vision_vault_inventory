import React from "react";

import style from './EditForm.module.scss';
import endpoint from "@utilities/endpoint";

const EditForm: React.FC = () => {
    return (
        <main className={style.editFormContainer}>
            <form action={`${endpoint}/products/new`} method="PUT">
                <div className={style.inputContainer}>
                    <label htmlFor="name"></label>
                    <input name="name" id="name" type="text" />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="description"></label>
                    <textarea name="description" id="description" />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="price"></label>
                    <input name="price" id="price" type="number" />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="number_in_stock"></label>
                    <input name="number_in_stock" id="number_in_stock" type="number" />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="genres"></label>
                    <input name="genres" id="genres" type="text" />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="type"></label>
                    <input name="genres" id="genres" type="text" />
                </div>

            </form>
        </main>
    );
};

export default EditForm;

// name, description, price, number_in_stock, genres, type,
