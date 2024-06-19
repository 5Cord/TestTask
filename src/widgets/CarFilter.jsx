import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from '../shared/axios';
import cl from './CarFilter.module.scss';

function CarFilter({ selectedFilters, onFilterChange }) {
    const [filters, setFilters] = useState({ brands: [], models: [], tarif: [] });
    const filterURL = "https://test.taxivoshod.ru/api/test/?w=catalog-filter";

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get(filterURL);
                if (response.data) {
                    setFilters({
                        brands: response.data.brands.values.map(value => ({ label: value, value })),
                        models: response.data.models.values.flatMap(item =>
                            item.models.map(model => ({ label: model, value: model, brand: item.brand }))
                        ),
                        tarif: Object.entries(response.data.tarif.values).map(([id, name]) => ({ label: name, value: name }))
                    });
                } else {
                    console.error("Неверный формат данных", response.data);
                }
            } catch (error) {
                console.error("Ошибка при выборе данных", error);
            }
        };
        fetchFilters();
    }, []);

    const getModelOptions = () => {
        if (selectedFilters.brands.length === 0) {
            return filters.models;
        } else {
            return filters.models.filter(model => selectedFilters.brands.includes(model.brand));
        }
    };

    return (
        <div className={cl.selectForm}>
            <Select
                className={cl.select}
                isMulti
                options={filters.brands}
                onChange={(selected) => onFilterChange(selected, 'brands')}
                value={filters.brands.filter(brand => selectedFilters.brands.includes(brand.value))}
                placeholder="Марка"
            />

            <Select
                className={cl.select}
                isMulti
                options={getModelOptions()}
                onChange={(selected) => onFilterChange(selected, 'models')}
                value={getModelOptions().filter(model => selectedFilters.models.includes(model.value))}
                placeholder="Модель"
            />

            <Select
                className={cl.select}
                isMulti
                options={filters.tarif}
                onChange={(selected) => onFilterChange(selected, 'tarif')}
                value={filters.tarif.filter(tarif => selectedFilters.tarif.includes(tarif.value))}
                placeholder="Тариф"
            />
        </div>
    );
}

export default CarFilter;
