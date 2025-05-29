"use client";
import { useRef, useEffect, useState } from 'react';
import Button from './Button';
import StartMenu from './StartMenu';
import styles from '../styles/Windows95.module.css';
import { TaskbarProps } from '../types';

const Taskbar: React.FC<TaskbarProps & {
    minimizedWindows: string[];
    onRestoreWindow: (id: string) => void;
}> = ({
    openWindows,
    startMenuOpen,
    toggleStartMenu,
    activeWindow,
    activateWindow,
    minimizedWindows,
    onRestoreWindow
}) => {
        const startMenuRef = useRef<HTMLDivElement>(null);
        const taskbarWindowsRef = useRef<HTMLDivElement>(null);
        const [isMobile, setIsMobile] = useState(false);
        const [showWindowList, setShowWindowList] = useState(false);
        const [taskbarItemWidth, setTaskbarItemWidth] = useState('auto');
        const [shouldWrap, setShouldWrap] = useState(false);

        // Detect mobile devices
        useEffect(() => {
            const checkMobile = () => {
                setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
            };

            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }, []);

        // Calculate taskbar item sizing and wrapping (desktop only)
        useEffect(() => {
            if (isMobile || !taskbarWindowsRef.current || openWindows.length === 0) {
                setTaskbarItemWidth('auto');
                setShouldWrap(false);
                return;
            }

            const calculateTaskbarLayout = () => {
                const taskbarWindows = taskbarWindowsRef.current;
                if (!taskbarWindows) return;

                const containerWidth = taskbarWindows.offsetWidth;
                const windowCount = openWindows.length;

                // Minimum width for taskbar items (before wrapping)
                const minItemWidth = 120;
                const maxItemWidth = 160;

                // Calculate ideal width per item
                const idealWidth = Math.floor(containerWidth / windowCount);

                if (idealWidth >= maxItemWidth) {
                    // Plenty of space - use max width
                    setTaskbarItemWidth(`${maxItemWidth}px`);
                    setShouldWrap(false);
                } else if (idealWidth >= minItemWidth) {
                    // Shrink items to fit
                    setTaskbarItemWidth(`${idealWidth}px`);
                    setShouldWrap(false);
                } else {
                    // Not enough space even at minimum - allow wrapping
                    setTaskbarItemWidth(`${minItemWidth}px`);
                    setShouldWrap(true);
                }
            };

            calculateTaskbarLayout();

            // Recalculate on window resize
            window.addEventListener('resize', calculateTaskbarLayout);
            return () => window.removeEventListener('resize', calculateTaskbarLayout);
        }, [openWindows.length, isMobile]);

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

        // Handle taskbar item click - restore if minimized or activate if visible
        const handleTaskbarItemClick = (windowId: string) => {
            if (minimizedWindows.includes(windowId)) {
                onRestoreWindow(windowId);
            } else {
                activateWindow(windowId as any);
            }
        };

        // Mobile layout
        if (isMobile) {
            return (
                <div className={styles.taskbarMobile}>
                    {/* Top bar with start button and hamburger menu */}
                    <div className={styles.mobileTopBar}>
                        <div className={styles.startButtonContainer}>
                            <Button
                                className={`${styles.startButton} ${styles.startButtonMobile}`}
                                onClick={() => toggleStartMenu()}
                            >
                                <img src="/icons/Windows logo (without text)-1.png" alt="Start" />
                            </Button>
                            {startMenuOpen && (
                                <div ref={startMenuRef} className={styles.startMenuMobile}>
                                    <StartMenu />
                                </div>
                            )}
                        </div>

                        <div className={styles.mobileControls}>
                            {/* Windows toggle button */}
                            {openWindows.length > 0 && (
                                <Button
                                    className={`${styles.windowsToggle} ${showWindowList ? styles.active : ''}`}
                                    onClick={() => setShowWindowList(!showWindowList)}
                                >
                                    <span className={styles.hamburger}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                    <span className={styles.windowCount}>{openWindows.length}</span>
                                </Button>
                            )}

                            {/* Clock */}
                            <div className={styles.clockMobile}>
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Collapsible window list */}
                    {showWindowList && openWindows.length > 0 && (
                        <div className={styles.mobileWindowList}>
                            {openWindows.map((window) => {
                                const isMinimized = minimizedWindows.includes(window.id as any);
                                const isActive = activeWindow === window.id && !isMinimized;

                                return (
                                    <Button
                                        key={window.id}
                                        className={`${styles.mobileTaskbarItem} ${isActive ? styles.taskbarItemActive : ''} ${isMinimized ? styles.taskbarItemMinimized : ''}`}
                                        onClick={() => {
                                            handleTaskbarItemClick(window.id as any);
                                            setShowWindowList(false);
                                        }}
                                    >
                                        <img src={window.icon} alt="" />
                                        <span>{window.title}</span>
                                        <div className={styles.mobileItemIndicator} />
                                        {isMinimized && <div className={styles.minimizedIndicator}>_</div>}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        // Desktop layout (original)
        return (
            <div className={`${styles.taskbar} ${shouldWrap ? styles.taskbarWrapped : ''}`}>
                <div className={styles.startButtonContainer}>
                    <Button
                        className={styles.startButton}
                        onClick={() => toggleStartMenu()}
                    >
                        <img src="/icons/Windows logo (without text)-1.png" alt="Start" />
                        <span className={styles.startText}>Start</span>
                    </Button>
                    {startMenuOpen && (
                        <div ref={startMenuRef}>
                            <StartMenu />
                        </div>
                    )}
                </div>
                <div
                    ref={taskbarWindowsRef}
                    className={`${styles.taskbarWindows} ${shouldWrap ? styles.taskbarWindowsWrapped : ''}`}
                >
                    {openWindows.map((window) => {
                        const isMinimized = minimizedWindows.includes(window.id as any);
                        const isActive = activeWindow === window.id && !isMinimized;

                        return (
                            <Button
                                key={window.id}
                                className={`${styles.taskbarItem} ${isActive ? styles.taskbarItemActive : ''} ${isMinimized ? styles.taskbarItemMinimized : ''}`}
                                onClick={() => handleTaskbarItemClick(window.id as any)}
                            // style={{ width: taskbarItemWidth }}
                            >
                                <img src={window.icon} alt="" />
                                <span className={styles.taskbarItemText}>{window.title}</span>
                                {isMinimized && <span className={styles.minimizedIndicator}>_</span>}
                            </Button>
                        );
                    })}
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
