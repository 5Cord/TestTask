import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [catalog, setCatalog] = useState([]);
    const [filters, setFilters] = useState({ brands: [], models: [], tarif: [] });
    const [selectedFilters, setSelectedFilters] = useState({ brand: '', model: '', tarif: '' });
    const apiURL = "https://test.taxivoshod.ru/api/test/?w=catalog-cars";
    const filterURL = "https://test.taxivoshod.ru/api/test/?w=catalog-filter";

    const fetchData = async () => {
        try {
            const response = await axios.get(apiURL);
            if (response.data && Array.isArray(response.data.list)) {
                setCatalog(response.data.list);
            } else {
                console.error("Data is not in expected format", response.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchFilters = async () => {
        try {
            const response = await axios.get(filterURL);
            if (response.data) {
                setFilters({
                    brands: response.data.brands.values,
                    models: response.data.models.values,
                    tarif: Object.entries(response.data.tarif.values)
                });
            } else {
                console.error("Filter data is not in expected format", response.data);
            }
        } catch (error) {
            console.error("Error fetching filter data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchFilters();
    }, []);

    const handleFilterChange = (e) => {
        setSelectedFilters({
            ...selectedFilters,
            [e.target.name]: e.target.value
        });
    };

    const filteredCatalog = catalog.filter(car => {
        const brandMatch = selectedFilters.brand ? car.brand === selectedFilters.brand : true;
        const modelMatch = selectedFilters.model ? car.model === selectedFilters.model : true;
        const tarifMatch = selectedFilters.tarif ? car.tarif.includes(selectedFilters.tarif) : true;
        return brandMatch && modelMatch && tarifMatch;
    });

    return (
        <div className="App">
            <div>
                <select name="brand" value={selectedFilters.brand} onChange={handleFilterChange}>
                    <option value="">Выберите марку</option>
                    {filters.brands.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
                <select name="model" value={selectedFilters.model} onChange={handleFilterChange}>
                    <option value="">Выберите модель</option>
                    {filters.models
                        .filter(item => item.brand === selectedFilters.brand)
                        .flatMap(item => item.models)
                        .map((model, index) => (
                            <option key={index} value={model}>{model}</option>
                        ))}
                </select>
                <select name="tarif" value={selectedFilters.tarif} onChange={handleFilterChange}>
                    <option value="">Выберите тариф</option>
                    {filters.tarif.map(([id, name]) => (
                        <option key={id} value={name}>{name}</option>
                    ))}
                </select>
            </div>
            <button onClick={fetchData}>Загрузить данные</button>
            {filteredCatalog.length > 0 ? (
                <div>
                    {filteredCatalog.map((car) => (
                        <div key={car.id}>
                            <h2>{car.brand} {car.model}</h2>
                            <p>Номер: {car.number}</p>
                            <p>Цена: {car.price} ₽</p>
                            <img src={car.image} alt={`${car.brand} ${car.model}`} />
                            <p>Тариф: {car.tarif.join(', ') || 'Нет тарифов'}</p>
                            {/* Добавьте другие нужные поля */}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Нет данных для отображения</p>
            )}
        </div>
    );
}

export default App;
