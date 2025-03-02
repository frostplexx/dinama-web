"use client";

import styles from '../styles/Windows95.module.css';
import { StartMenuProps } from '../types';

const StartMenu: React.FC<StartMenuProps> = () => {
    return (
        <div className={styles.startMenu}>
            <div className={styles.startMenuHeader}>
                <div className={styles.startMenuLogo}>Windows 95</div>
            </div>

            <div className={styles.startMenuContent}>
                <div className={styles.startMenuItem}>
                    <img src="/icons/Program Folder (16x16px & 32x32px)-0.png" alt="" />
                    <span>Programs</span>
                    <span className={styles.arrow}>▶</span>
                </div>
                <div className={styles.startMenuItem}>
                    <img src="/icons/Documents Folder-0.png" alt="" />
                    <span>Documents</span>
                    <span className={styles.arrow}>▶</span>
                </div>
                <div className={styles.startMenuItem}>
                    <img src="/icons/Settings-0.png" alt="" />
                    <span>Settings</span>
                    <span className={styles.arrow}>▶</span>
                </div>
                <div className={styles.startMenuItem}>
                    <img src="/icons/Search in sheet (16x16px & 24x24px)-0.png" alt="" />
                    <span>Find</span>
                    <span className={styles.arrow}>▶</span>
                </div>
                <div className={styles.startMenuItem}>
                    <img src="/icons/Help 3D-0.png" alt="" />
                    <span>Help</span>
                </div>
                <div className={styles.startMenuItem}>
                    <img src="/icons/Search folder-1.png" alt="" />
                    <span>Run...</span>
                </div>

                <div className={styles.startMenuDivider}></div>

                <div className={styles.startMenuItem}>
                    <img src="/icons/Night on computer-0.png" alt="" />
                    <span>Suspend</span>
                </div>

                <div className={styles.startMenuItem}>
                    <img src="/icons/Turn Off Computer (full)-0.png" alt="" />
                    <span>Shut Down...</span>
                </div>
            </div>
        </div>
    );
};

export default StartMenu;
