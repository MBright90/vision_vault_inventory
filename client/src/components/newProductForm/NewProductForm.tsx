import React, { useEffect, useState } from "react";

import retrieveTypes from "@utilities/retrieveTypes";
import { type FilterIdSet } from "@custom_types/types";

import style from './NewProductForm.module.scss';

const NewProductForm: React.FC = () => {
    const [typeIdArr, setTypeIdArr] = useState<FilterIdSet[]>([]);
    const [typeOptions, setTypeOptions] = useState<React.ReactNode[]>([]);

    const [currentName, setCurrentName] = useState<string>('');
    const [currentType, setCurrentType] = useState<string>('Select type...');

    useEffect(() => {
        void(retrieveTypes(setTypeOptions, setTypeIdArr));
    }, []);

    useEffect(() => { // to remove
        console.log(currentName); 
        console.log(currentType);
        console.log(typeIdArr);
    }, [currentType]);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setCurrentName(e.target.value);
    }

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        setCurrentType(e.target.value.toLowerCase());
    }

    return (<div className={style.formContainer}>
        <h3>Add Product</h3>
        <form action="" className={style.newProductForm}>

            <div className={style.inputContainer}>
                <label htmlFor="name-input">Product Name</label>
                <input id="name-input" name="name-input" type="text" onChange={(e) => { handleNameChange(e); }} required />
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
                <label htmlFor="type-input">Type</label>
                <select id="type-input" name="type-input" onChange={(e) => { handleTypeChange(e); }} required>
                    {typeOptions}
                </select>
                {/* <p className={style.inputInfo}>
                    Separate genres with a comma
                </p> */}
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="genres-input">Genres</label>
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
