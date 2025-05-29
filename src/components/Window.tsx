"use client";

import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import styles from '../styles/Windows95.module.css';
import { WindowProps, Position, DragOffset } from '../types';

const Window: React.FC<WindowProps & { onMinimize?: (id: string) => void; onRestore?: (id: string) => void }> = ({
    id,
    title,
    icon,
    children,
    isActive,
    initialPosition,
    onClose,
    onActivate,
    onMinimize,
    onRestore
}) => {
    const [position, setPosition] = useState<Position>(initialPosition || { x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
    const [isMaximized, setIsMaximized] = useState<boolean>(false);
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const windowRef = useRef<HTMLDivElement>(null);

    // Detect mobile devices
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle mouse and touch dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && !isMaximized && !isMobile) {
                e.preventDefault();
                setPosition({
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging && !isMaximized && isMobile) {
                e.preventDefault();
                const touch = e.touches[0];
                setPosition({
                    x: touch.clientX - dragOffset.x,
                    y: touch.clientY - dragOffset.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            if (isMobile) {
                document.addEventListener('touchmove', handleTouchMove, { passive: false });
                document.addEventListener('touchend', handleTouchEnd);
            } else {
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, dragOffset, isMaximized, isMobile]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized || isMinimized) return;

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

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isMaximized || isMinimized) return;

        onActivate();
        setIsDragging(true);

        if (windowRef.current) {
            const touch = e.touches[0];
            const windowRect = windowRef.current.getBoundingClientRect();
            setDragOffset({
                x: touch.clientX - windowRect.left,
                y: touch.clientY - windowRect.top
            });
        }
    };

    const toggleMaximize = () => {
        if (isMinimized) {
            setIsMinimized(false);
        }
        setIsMaximized(!isMaximized);
    };

    const toggleMinimize = () => {
        if (isMaximized) {
            setIsMaximized(false);
        }

        const newMinimizedState = !isMinimized;
        setIsMinimized(newMinimizedState);

        // Notify parent component about minimize/restore
        if (newMinimizedState && onMinimize) {
            onMinimize(id as any);
        } else if (!newMinimizedState && onRestore) {
            onRestore(id as any);
        }
    };

    const handleWindowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onActivate();
    };

    // Don't render the window content if minimized, but keep the window in DOM for taskbar reference
    if (isMinimized) {
        return null;
    }

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
                onTouchStart={handleTouchStart}
            >
                <div className={styles.windowTitle}>
                    {icon && <img src={icon} alt="" className={styles.windowIcon} />}
                    <span>{title}</span>
                </div>
                <div className={styles.windowControls}>
                    <Button className={styles.windowButton} onClick={toggleMinimize}>_</Button>
                    <Button className={styles.windowButton} onClick={toggleMaximize}>□</Button>
                    <Button className={styles.closeButton} onClick={onClose}>×</Button>
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
