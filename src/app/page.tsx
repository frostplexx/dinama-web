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
    const [minimizedWindows, setMinimizedWindows] = useState<number[]>([]);

    const openWindow = (title: string, content: React.ReactNode, icon: string) => {
        const windowId = Date.now();
        const newWindow = {
            id: windowId,
            title,
            content,
            icon,
            position: {
                x: 50 + (openWindows.length * 20),
                y: 50 + (openWindows.length * 20)
            }
        };

        setOpenWindows([...openWindows, newWindow]);
        setActiveWindow(windowId);

        // Remove from minimized if it was minimized (shouldn't happen for new windows, but just in case)
        setMinimizedWindows(prev => prev.filter(id => id !== windowId));
    };

    const closeWindow = (id: number) => {
        setOpenWindows(openWindows.filter(window => window.id !== id));
        setMinimizedWindows(prev => prev.filter(windowId => windowId !== id));

        if (activeWindow === id) {
            const remainingWindows = openWindows.filter(window => window.id !== id);
            const visibleWindows = remainingWindows.filter(window => !minimizedWindows.includes(window.id));
            setActiveWindow(visibleWindows.length > 0 ? visibleWindows[0].id : null);
        }
    };

    const toggleStartMenu = () => {
        setStartMenuOpen(!startMenuOpen);
    };

    const activateWindow = (id: number | null) => {
        if (id === null) {
            setActiveWindow(null);
            return;
        }

        // If window is minimized, restore it first
        if (minimizedWindows.includes(id)) {
            handleRestoreWindow(id);
        } else {
            setActiveWindow(id);
        }
    };

    const handleMinimizeWindow = (windowId: number) => {
        setMinimizedWindows(prev => [...prev, windowId]);

        // If this was the active window, find another window to activate
        if (activeWindow === windowId) {
            const visibleWindows = openWindows.filter(window =>
                window.id !== windowId && !minimizedWindows.includes(window.id)
            );
            setActiveWindow(visibleWindows.length > 0 ? visibleWindows[0].id : null);
        }
    };

    const handleRestoreWindow = (windowId: number) => {
        setMinimizedWindows(prev => prev.filter(id => id !== windowId));
        setActiveWindow(windowId);
    };

    return (
        <div className={styles.windows95}>
            <Desktop
                openWindow={openWindow}
                activeWindow={activeWindow}
                activateWindow={activateWindow}
            />

            {openWindows.map((window) => {
                // Don't render minimized windows
                if (minimizedWindows.includes(window.id)) {
                    return null;
                }

                return (
                    <Window
                        key={window.id}
                        id={window.id}
                        title={window.title}
                        icon={window.icon}
                        isActive={activeWindow === window.id}
                        initialPosition={window.position}
                        onClose={() => closeWindow(window.id)}
                        onActivate={() => activateWindow(window.id)}
                        onMinimize={handleMinimizeWindow as any}
                        onRestore={handleRestoreWindow as any} content={undefined}                    >
                        {window.content}
                    </Window>
                );
            })}

            <Taskbar
                openWindows={openWindows}
                startMenuOpen={startMenuOpen}
                toggleStartMenu={toggleStartMenu}
                activeWindow={activeWindow}
                activateWindow={activateWindow}
                minimizedWindows={minimizedWindows as any}
                onRestoreWindow={handleRestoreWindow as any}
            />
        </div>
    );
}
