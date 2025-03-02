"use client";

import { useRef, useEffect } from 'react';
import Button from './Button';
import StartMenu from './StartMenu';
import styles from '../styles/Windows95.module.css';
import { TaskbarProps } from '../types';

const Taskbar: React.FC<TaskbarProps> = ({
    openWindows,
    startMenuOpen,
    toggleStartMenu,
    activeWindow,
    activateWindow
}) => {
    const startMenuRef = useRef<HTMLDivElement>(null);

    // Close start menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (startMenuOpen &&
                startMenuRef.current &&
                !startMenuRef.current.contains(event.target as Node) &&
                !(event.target as Element).classList.contains(styles.startButton)) {
                toggleStartMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [startMenuOpen, toggleStartMenu]);

    return (
        <div className={styles.taskbar}>
            <div className={styles.startButtonContainer}>
                <Button
                    className={styles.startButton}
                    onClick={() => toggleStartMenu()}
                >
                    <img src="/icons/Windows logo (without text)-1.png" alt="Start" />
                    <span className='font-bold'>Start</span>
                </Button>

                {startMenuOpen && (
                    <div ref={startMenuRef}>
                        <StartMenu />
                    </div>
                )}
            </div>

            <div className={styles.taskbarWindows}>
                {openWindows.map((window) => (
                    <Button
                        key={window.id}
                        className={`${styles.taskbarItem} ${activeWindow === window.id ? styles.taskbarItemActive : ''}`}
                        onClick={() => activateWindow(window.id)}
                    >
                        <img src={window.icon} alt="" />
                        <span>{window.title}</span>
                    </Button>
                ))}
            </div>

            <div className={styles.tray}>
                <div className={styles.clock}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
