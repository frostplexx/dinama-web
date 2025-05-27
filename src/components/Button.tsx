import React from 'react';
import styles from '../styles/Windows95.module.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className = '',
    disabled = false,
    type = 'button'
}) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
