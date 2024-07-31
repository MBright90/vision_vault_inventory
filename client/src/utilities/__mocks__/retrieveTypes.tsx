import React from "react";

export default jest.fn(async (setFilterOptions, setFilterIdArr, selected) => {
    const data = [
        { _id: 'type1', name: 'Type 1' },
        { _id: 'type2', name: 'Type 2' },
    ];

    const filterNodes = data.map(type => (
        <option key={type._id} data-id={type._id} selected={selected === type.name}>
            {type.name}
        </option>
    ));
    setFilterOptions(filterNodes);

    if (setFilterIdArr) {
        const filterIds = data.map(type => ({ name: type.name, _id: type._id }));
        setFilterIdArr([{ name: 'all', _id: 'all' }, ...filterIds]);
    }
});