import cl from './App.module.scss'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import CarDetail from './pages/CarDetail';
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
    const [catalog, setCatalog] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ brands: [], models: [], tarif: [] });
    const [selectedFilters, setSelectedFilters] = useState({ brands: [], models: [], tarif: [] });
    const apiURL = `https://test.taxivoshod.ru/api/test/?w=catalog-cars&page=${page}`;
    const filterURL = "https://test.taxivoshod.ru/api/test/?w=catalog-filter";
    const nextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };
    const prevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    console.log(page)

    const fetchData = async () => {
        try {
            const response = await axios.get(apiURL);
            if (response.data && Array.isArray(response.data.list)) {
                setCatalog(response.data.list);
            } else {
                console.error("Неверный формат данных", response.data);
            }
        } catch (error) {
            console.error("Ошибка при выборе данных", error);
        }
    };
    useEffect(() => {
        fetchData(page);
    }, [page]);

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
            console.error("Ошибка при выборе данных ", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchFilters();
    }, []);

    const handleFilterChange = (selectedOptions, filterType) => {
        setSelectedFilters(prevState => ({
            ...prevState,
            [filterType]: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    const filteredCatalog = catalog.filter(car => {
        const brandMatch = selectedFilters.brands.length > 0 ? selectedFilters.brands.includes(car.brand) : true;
        const modelMatch = selectedFilters.models.length > 0 ? selectedFilters.models.includes(car.model) : true;
        const tarifMatch = selectedFilters.tarif.length > 0 ? selectedFilters.tarif.some(tarif => car.tarif.includes(tarif)) : true;
        return brandMatch && modelMatch && tarifMatch;
    });

    const getModelOptions = () => {
        if (selectedFilters.brands.length === 0) {
            return filters.models;
        } else {
            return filters.models.filter(model => selectedFilters.brands.includes(model.brand));
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="App">
                        <div className={cl.container}>

                            <div className={cl.selectForm}>
                                <h5>Марка</h5>
                                <h5>Модель</h5>
                                <h5>Тариф</h5>
                            </div>
                            <div className={cl.selectForm}>
                                <Select className={cl.select}
                                    isMulti
                                    options={filters.brands}
                                    onChange={(selected) => handleFilterChange(selected, 'brands')}
                                    value={filters.brands.filter(brand => selectedFilters.brands.includes(brand.value))}
                                />
                                <Select
                                    className={cl.select}
                                    isMulti
                                    options={getModelOptions()}
                                    onChange={(selected) => handleFilterChange(selected, 'models')}
                                    value={getModelOptions().filter(model => selectedFilters.models.includes(model.value))}
                                />

                                <Select
                                    className={cl.select}
                                    isMulti
                                    options={filters.tarif}
                                    onChange={(selected) => handleFilterChange(selected, 'tarif')}
                                    value={filters.tarif.filter(tarif => selectedFilters.tarif.includes(tarif.value))}
                                />
                            </div>
                            <div className={cl.header_title}>
                                <h1>АРЕНДА АВТОМОБИЛЕЙ</h1>
                                <div className={cl.pagination}>
                                    <Button variant="outline-dark" onClick={prevPage}>←</Button>
                                    <h6> Страница {page}</h6>
                                    <Button variant="outline-dark" onClick={nextPage}>→</Button>
                                </div>
                            </div>
                            {filteredCatalog.length > 0 ? (
                                <div className={cl.netting}>
                                    {filteredCatalog.map((car) => (
                                        <Link key={car.id} to={`/car/${car.id}`} className="card-link">
                                            <Card style={{ width: '25rem' }} className={cl.card}>
                                                <Card.Img variant="top" src={car.image} />
                                                <Card.Body>
                                                    <Card.Title>{car.brand} {car.model}</Card.Title>
                                                    <Card.Text>
                                                        <p>Тариф: {car.tarif.join(', ') || 'Нет тарифов'}</p>
                                                        <p>Номер: {car.number}</p>
                                                        <p><b>Цена: {car.price} ₽</b></p>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p>Нет данных для отображения</p>
                            )}
                        </div>
                    </div>
                } />
                <Route path="/car/:id" element={<CarDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
