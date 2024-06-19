import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({ children, onClick, variant = 'outline-dark', ...props }) => {
    return (
        <Button variant={variant} onClick={onClick} {...props}>
            {children}
        </Button>
    );
};

export default CustomButton;
