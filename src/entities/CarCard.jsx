import React from 'react';
import { Card } from 'react-bootstrap';
import cl from './CarCard.module.scss';

function CarCard({ car }) {
    return (
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
    );
}

export default CarCard;
