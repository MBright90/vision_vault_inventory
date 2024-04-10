import React from "react";

import style from './NewProductForm.module.scss';

const NewProductForm: React.FC = () => {
    return (<div className={style.formContainer}>
        <h3>Add Product</h3>
        <form action="" className={style.newProductForm}>

            <div className={style.inputContainer}>
                <label htmlFor="name-input">Product Name</label>
                <input id="name-input" name="name-input" type="text" required />
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="description-input">Description</label>
                <textarea id="description-input" name="description-input" required />
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="stock-input">Initial stock</label>
                <input id="stock-input" name="stock-input" type="number" max={100} min={0} required />
                <p className={style.inputInfo}>
                    Max 100
                </p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="genres-input">Image</label>
                <input id="genres-input" name="genres-input" type="text" required />
                <p className={style.inputInfo}>
                    Separate genres with a comma
                </p>
            </div>

            <button className={style.formSubmitBtn} type="submit">Add Product</button>
        </form>
    </div>
    );
};

export default NewProductForm;
