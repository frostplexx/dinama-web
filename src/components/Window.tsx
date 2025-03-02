"use client";

import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import styles from '../styles/Windows95.module.css';
import { WindowProps, Position, DragOffset } from '../types';

const Window: React.FC<WindowProps> = ({
    id,
    title,
    icon,
    children,
    isActive,
    initialPosition,
    onClose,
    onActivate
}) => {
    const [position, setPosition] = useState<Position>(initialPosition || { x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
    const [isMaximized, setIsMaximized] = useState<boolean>(false);
    const windowRef = useRef<HTMLDivElement>(null);

    // Handle window dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && !isMaximized) {
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, isMaximized]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized) return;

        onActivate();
        setIsDragging(true);

        if (windowRef.current) {
            const windowRect = windowRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - windowRect.left,
                y: e.clientY - windowRect.top
            });
        }
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleWindowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onActivate();
    };

    return (
        <div
            ref={windowRef}
            className={`${styles.window} ${isActive ? styles.activeWindow : ''} ${isMaximized ? styles.maximizedWindow : ''}`}
            style={isMaximized ? {} : { left: `${position.x}px`, top: `${position.y}px` }}
            onClick={handleWindowClick}
        >
            <div
                className={styles.windowTitleBar}
                onMouseDown={handleMouseDown}
            >
                <div className={styles.windowTitle}>
                    {icon && <img src={icon} alt="" className={styles.windowIcon} />}
                    <span>{title}</span>
                </div>
                <div className={styles.windowControls}>
                    <Button className={styles.windowButton} onClick={() => { }}>_</Button>
                    <Button className={styles.windowButton} onClick={toggleMaximize}>□</Button>
                    <Button className={styles.windowCloseButton} onClick={onClose}>×</Button>
                </div>
            </div>

            <div className={styles.windowMenuBar}>
                <Button className={styles.menuItem}>File</Button>
                <Button className={styles.menuItem}>Edit</Button>
                <Button className={styles.menuItem}>View</Button>
                <Button className={styles.menuItem}>Help</Button>
            </div>

            <div className={styles.windowContent}>
                {children}
            </div>

            <div className={styles.windowStatusBar}>
                <div className={styles.statusItem}>Ready</div>
            </div>
        </div>
    );
};

export default Window;
