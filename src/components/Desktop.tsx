"use client";

import { useState } from 'react';
import Icon from './Icon';
import styles from '../styles/Windows95.module.css';
import { DesktopProps } from '../types';

const Desktop: React.FC<DesktopProps> = ({ openWindow, activeWindow, activateWindow }) => {
    // Sample desktop icons
    const desktopIcons = [
        {
            id: 'my-computer',
            name: 'My Computer',
            icon: '/icons/My Computer-0.png',
            onClick: () => openWindow('My Computer', <ComputerContent />, '/icons/My Computer-0.png')
        },
        {
            id: 'recycle-bin',
            name: 'Recycle Bin',
            icon: '/icons/Empty Recycle Bin-0.png',
            onClick: () => openWindow('Recycle Bin', <RecycleBinContent />, '/icons/Empty Recycle Bin-0.png')
        },
        {
            id: 'my-documents',
            name: 'My Documents',
            icon: '/icons/Documents Folder-0.png',
            onClick: () => openWindow('My Documents', <DocumentsContent />, '/icons/Documents Folder-0.png')
        },
    ];

    const handleDesktopClick = () => {
        // Clear active window when clicking on desktop
        activateWindow(null);
    };

    return (
        <div className={styles.desktop} onClick={handleDesktopClick}>
            <div className={styles.iconGrid}>
                {desktopIcons.map((icon) => (
                    <Icon
                        key={icon.id}
                        id={icon.id}
                        name={icon.name}
                        icon={icon.icon}
                        onClick={(e) => {
                            e.stopPropagation();
                            icon.onClick();
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Sample window contents
const ComputerContent: React.FC = () => (
    <div className={styles.windowContent}>
        <h3>My Computer</h3>
        <div className={styles.iconGrid}>
            <Icon name="(C:)" icon="/icons/Drive-0.png" onClick={() => { }} />
            <Icon name="3½ Floppy (A:)" icon="/icons/Diskette Drive with Diskette-0.png" onClick={() => { }} />
            <Icon name="CD Drive (D:)" icon="/icons/Disc Drive-0.png" onClick={() => { }} />
            <Icon name="Control Panel" icon="/icons/Settings-0.png" onClick={() => { }} />
        </div>
    </div>
);

const RecycleBinContent: React.FC = () => (
    <div className={styles.windowContent}>
        <h3>Recycle Bin</h3>
        <p>The Recycle Bin is empty.</p>
    </div>
);

const DocumentsContent: React.FC = () => (
    <div className={styles.windowContent}>
        <h3>My Documents</h3>
        <div className={styles.iconGrid}>
            <Icon name="Important.doc" icon="/icons/WordPad document-0.png" onClick={() => { }} />
            <Icon name="Spreadsheet.xls" icon="/icons/Windows document-0.png" onClick={() => { }} />
            <Icon name="Presentation.ppt" icon="/icons/Windows document-0.png" onClick={() => { }} />
        </div>
    </div>
);

export default Desktop;
