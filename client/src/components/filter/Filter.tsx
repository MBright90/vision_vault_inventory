import React, { useEffect, useState } from "react";

import retrieveTypes from "@utilities/retrieveTypes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { type FilterIdSet } from "@custom_types/types";

import style from './Filter.module.scss';

interface FilterProps {
    goBack: () => void;
    productIsActive: boolean,
    updateFilter: (newFilter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ goBack, productIsActive, updateFilter }) => {
    const [filterIdArr, setFilterIdArr] = useState<FilterIdSet[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [filterOptions, setFilterOptions] = useState<React.ReactNode[]>([]);

    // Create option nodes for select element list
    useEffect(() => {
        void retrieveTypes(setFilterOptions, setFilterIdArr);
    }, []);

    // Pass selected filter id to parent component on change
    useEffect(() => {
        const newFilterIndex = filterIdArr.findIndex((type) => selectedFilter === type.name);
        if (newFilterIndex >= 0) updateFilter(filterIdArr[newFilterIndex]._id);
    }, [selectedFilter]);

    function toggleFilter(e: React.ChangeEvent<HTMLSelectElement>): void {
        setSelectedFilter(e.target.value.toLowerCase());
    };

    // Include back button in controls if a product is currently active
    const back: React.ReactNode | null = productIsActive ? <button onClick={goBack} className={style.back}>
        <FontAwesomeIcon icon={faBackward} /> <span>Go Back</span>
    </button> : null;

    return (
        <div className={style.filterContainer}>
            { back }
            <select className={style.filterSelect} name="filter-select" id='filter-select' value={selectedFilter} data-testid="filter-select" onChange={(e) => {toggleFilter(e);}}>
                <option className={style.filterOption} value="all">All</option>
                { filterOptions }
            </select>
        </div>
    );
};

export default Filter;
