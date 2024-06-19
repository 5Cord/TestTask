import React, { useState, useEffect } from 'react';
import axios from '../shared/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useFilters } from '../shared/FilterContext';
import cl from './CarList.module.scss';
import CarCard from '../entities/CarCard';
import CarFilter from '../widgets/CarFilter';

const CarList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialPage = parseInt(query.get('page')) || 1;

  const [catalog, setCatalog] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState({ brands: [], models: [], tarif: [] });
  const { selectedFilters, setSelectedFilters } = useFilters();
  const apiURL = `https://test.taxivoshod.ru/api/test/?w=catalog-cars&page=${page}`;
  const filterURL = "https://test.taxivoshod.ru/api/test/?w=catalog-filter";

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    navigate(`?page=${page}`, { replace: true });
  }, [page, navigate]);

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
    <div className={cl.container}>
      <h4>Подобрать авто:</h4>
      <CarFilter
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
      <div className={cl.header_title}>
        <h1>АРЕНДА АВТОМОБИЛЕЙ</h1>
        <div className={cl.pagination}>
          <Button variant="outline-dark" onClick={() => setPage(page > 1 ? page - 1 : 1)}>←</Button>
          <h6> Страница {page}</h6>
          <Button variant="outline-dark" onClick={() => setPage(page + 1)}>→</Button>
        </div>
      </div>
      {filteredCatalog.length > 0 ? (
        <div className={cl.netting}>
          {filteredCatalog.map((car) => (
            <Link key={car.id} to={`/car/${car.id}`} className="card-link">
              <CarCard car={car} />
            </Link>
          ))}
        </div>
      ) : (
        <p>Нет данных для отображения</p>
      )}
    </div>
  );
};

export default CarList;
