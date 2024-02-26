import React from "react";

import style from './NewProductForm.module.scss';

const NewProductForm: React.FC = () => {
    return (
        <form action="" className={style.newProductForm}>

            <label htmlFor="name-input">
                Product Name:
                <input id="name-input" name="name-input" type="text" required />
            </label>

            <label htmlFor="description-input">
                Description:
                <textarea id="description-input" name="description-input" required />
            </label>

            <label htmlFor="stock-input">
                Initial stock:
                <input id="stock-input" name="stock-input" type="number" min={0} required />
            </label>

            <label htmlFor="image-input">
                Image:
                <input id="image-input" name="image-input" type="text" required />
            </label>
        </form>
    );
};

export default NewProductForm;
