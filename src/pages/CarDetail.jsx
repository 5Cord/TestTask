import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';

function CarDetail() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const carDetailURL = `https://test.taxivoshod.ru/api/test/?w=catalog-car&id=${id}`;

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(carDetailURL);
                if (response.data && response.data.item) {
                    setCar(response.data.item);
                } else {
                    console.error("Неверный формат", response.data);
                }
            } catch (error) {
                console.error("Ошибка при полученнии данных", error);
            }
        };

        fetchCarDetails();
    }, [id]);
    if (!car) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <Container>
            <h2>{car.brand} {car.model}</h2>
            <p><b>Цена: {car.price} ₽</b></p>
            <div className="images-container">
                {car.images.map((image) => (
                    <img key={image.id} src={image.image} alt={`${car.brand} ${car.model}`} />
                ))}
            </div>
            <p>Тариф: {car.tarif.join(', ') || 'Нет тарифов'}</p>
        </Container>
    );
}

export default CarDetail;
