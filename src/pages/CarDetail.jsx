import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../shared/axios';
import { Button, Container } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import cl from './CarDetail.module.scss';

function CarDetailPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const carDetailURL = `https://test.taxivoshod.ru/api/test/?w=catalog-car&id=${id}`;
    const navigate = useNavigate();

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
                console.error("Ошибка при получении данных", error);
            }
        };

        fetchCarDetails();
    }, [id]);

    if (!car) {
        return <p>Загрузка данных...</p>;
    }

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <Container className={cl.containerCard}>
            <Button className={cl.goToBack} variant="outline-dark" onClick={() => navigate(-1)}>К списку</Button>
            <div className={cl.sliderContainer}>
                {car.images && car.images.length > 1 ? (
                    <Carousel showThumbs={true} dynamicHeight={true} infiniteLoop={true}>
                        {car.images.map((image, index) => (
                            <div key={index}>
                                <img src={image.image} alt={`${car.brand} ${car.model}`} />
                            </div>
                        ))}
                    </Carousel>
                ) : car.images && car.images.length === 1 ? (
                    <img src={car.images[0].image} alt={`${car.brand} ${car.model}`} />
                ) : (
                    <p>Изображений нет</p>
                )}
            </div>
            <div className={cl.row}>
                <h2>{car.brand} {car.model}</h2>
                <p><b>Цена: {car.price} ₽</b></p>
                <p>Тариф: {car.tarif.join(', ') || 'Нет тарифов'}</p>
                <Button variant="outline-dark" onClick={handleCheckout}>Оформить</Button>
            </div>
        </Container>
    );
}

export default CarDetailPage;
