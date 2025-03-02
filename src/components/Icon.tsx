"use client";

import styles from '../styles/Windows95.module.css';
import { IconProps } from '../types';

const Icon: React.FC<IconProps> = ({ name, icon, onClick }) => {
    return (
        <div className={styles.icon} onClick={onClick}>
            <div className={styles.iconImage}>
                <img src={icon} alt={name} />
            </div>
            <div className={styles.iconText}>{name}</div>
        </div>
    );
};

export default Icon;
