import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cl from '../App.module.scss';
function CarDetail() {
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
                console.error("Ошибка при полученнии данных", error);
            }
        };

        fetchCarDetails();
    }, [id]);

    if (!car) {
        return <p>Загрузка данных...</p>;
    }

    const settings = {
        customPaging: function (i) {
            return (
                <a>
                    <img src={car.images[i].image} alt={`${car.brand} ${car.model}`} />
                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Container className={cl.containerCard}>
            <Button className={cl.goToBack} variant="outline-dark" onClick={() => navigate(-1)}>←</Button>
            <div className={cl.sliderContainer}>
                {car.images && car.images.length > 1 ? (
                    <Slider {...settings}>
                        {car.images.map((image, index) => (
                            <div key={index}>
                                <img src={image.image} alt={`${car.brand} ${car.model}`} />
                            </div>
                        ))}
                    </Slider>
                ) : car.images && car.images.length === 1 ? (
                    <img className={cl.miniImg} src={car.images[0].image} alt={`${car.brand} ${car.model}`} />
                ) : (
                    <p>Изображений нет</p>
                )}
            </div>
            <div className={cl.row}>
                <h2>{car.brand} {car.model}</h2>
                <p><b>Цена: {car.price} ₽</b></p>
                <p>Тариф: {car.tarif.join(', ') || 'Нет тарифов'}</p>
            </div>
        </Container>
    );
}

export default CarDetail;
