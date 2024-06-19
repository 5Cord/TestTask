import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
    const [selectedFilters, setSelectedFilters] = useState({ brands: [], models: [], tarif: [] });

    return (
        <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>
            {children}
        </FilterContext.Provider>
    );
};
