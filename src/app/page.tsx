"use client";

import { useState } from 'react';
import Desktop from '../components/Desktop';
import Taskbar from '../components/Taskbar';
import Window from '../components/Window';
import styles from '../styles/Windows95.module.css';
import { WindowData } from '../types';

export default function Home() {
    const [openWindows, setOpenWindows] = useState<WindowData[]>([]);
    const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
    const [activeWindow, setActiveWindow] = useState<number | null>(null);

    const openWindow = (title: string, content: React.ReactNode, icon: string) => {
        const windowId = Date.now();
        setOpenWindows([
            ...openWindows,
            {
                id: windowId,
                title,
                content,
                icon,
                position: {
                    x: 50 + (openWindows.length * 20),
                    y: 50 + (openWindows.length * 20)
                }
            }
        ]);
        setActiveWindow(windowId);
    };

    const closeWindow = (id: number) => {
        setOpenWindows(openWindows.filter(window => window.id !== id));
        if (activeWindow === id) {
            setActiveWindow(openWindows.length > 1 ? openWindows[0].id : null);
        }
    };

    const toggleStartMenu = () => {
        setStartMenuOpen(!startMenuOpen);
    };

    const activateWindow = (id: number | null) => {
        setActiveWindow(id);
    };

    return (
        <div className={styles.windows95}>
            <Desktop
                openWindow={openWindow}
                activeWindow={activeWindow}
                activateWindow={activateWindow}
            />

            {openWindows.map((window) => (
                <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    icon={window.icon}
                    isActive={activeWindow === window.id}
                    initialPosition={window.position}
                    onClose={() => closeWindow(window.id)}
                    onActivate={() => activateWindow(window.id)} content={undefined}                >
                    {window.content}
                </Window>
            ))}

            <Taskbar
                openWindows={openWindows}
                startMenuOpen={startMenuOpen}
                toggleStartMenu={toggleStartMenu}
                activeWindow={activeWindow}
                activateWindow={activateWindow}
            />
        </div>
    );
}
