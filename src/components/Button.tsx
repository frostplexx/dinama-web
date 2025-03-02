"use client";

import styles from '../styles/Windows95.module.css';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => {
    return (
        <button
            className={`${styles.button} ${className || ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
