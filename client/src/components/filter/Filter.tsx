import React, { useEffect, useState } from "react";

import type { productType_type } from "@custom_types/types";
import endpoint from "@utilities/endpoint";
import capitalize from "@utilities/capitalize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import style from './Filter.module.scss';

interface FilterIdSet{
    name: string,
    _id: string
}

interface FilterProps {
    goBack: () => void;
    productIsActive: boolean,
    updateFilter: (newFilter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ goBack, productIsActive, updateFilter }) => {
    const [filterIdArr, setFilterIdArr] = useState<FilterIdSet[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [filterOptions, setFilterOptions] = useState<React.ReactNode[]>([]);

    function toggleFilter(e: React.ChangeEvent<HTMLSelectElement>): void {
        setSelectedFilter(e.target.value.toLowerCase());
    }

    // Create option nodes for select element list
    useEffect(() => {
        const retrieveTypes = async (): Promise<void> => {
            let data: productType_type[] = [];
            try {
                const response = await fetch(`${endpoint}/types/`);
                data = await response.json();
                // Create ReactNode arr
                const filterNodes: React.ReactNode[] = data.map((type: productType_type) => {
                    return (<option className={style.filterOption} key={type._id} data-id={type._id}>
                        {capitalize(type.name)}
                    </option>);
                });
                setFilterOptions(filterNodes);

                // Create filterId arr
                const filterIds: FilterIdSet[] = data.map((type: productType_type) => {
                    return { name: type.name, _id: type._id };
                });
                setFilterIdArr([{ name: 'all', _id: 'all' }, ...filterIds]);
            } catch (err) {
                console.log(err);
            }
        };

        void retrieveTypes();
    }, []);

    // Pass selected filter id to parent component on change
    useEffect(() => {
        const newFilterIndex = filterIdArr.findIndex((type) => selectedFilter === type.name);
        if (newFilterIndex >= 0) updateFilter(filterIdArr[newFilterIndex]._id);
    }, [selectedFilter]);

    // Include back button in controls if a product is currently active
    const back: React.ReactNode | null = productIsActive ? <button onClick={goBack} className={style.back}>
        <FontAwesomeIcon icon={faBackward} /> <span>Go Back</span>
    </button> : null;

    return (
        <div className={style.filterContainer}>
            { back }
            <select className={style.filterSelect} name="filter-select" id='filter-select' onChange={(e) => {toggleFilter(e);}}>
                <option className={style.filterOption} value="all">All</option>
                { filterOptions }
            </select>
        </div>
    );
};

export default Filter;
