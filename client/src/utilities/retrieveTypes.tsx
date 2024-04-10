import React from "react";
import capitalize from "./capitalize";

import { type productType_type } from "@custom_types/types";
import endpoint from "./endpoint";

interface FilterIdSet{
    name: string,
    _id: string
}

const retrieveTypes = async (
    setFilterOptions: (nodes: React.ReactNode[]) => void,
    setFilterIdArr: (idSet: FilterIdSet[]) => void
    ): Promise<void> => {
    let data: productType_type[] = [];
    try {
        const response = await fetch(`${endpoint}/types/`);
        data = await response.json();
        // Create ReactNode arr
        const filterNodes: React.ReactNode[] = data.map((type: productType_type) => {
            return (<option key={type._id} data-id={type._id}>
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

export default retrieveTypes;