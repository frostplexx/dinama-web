export interface WindowProps {
    id: number;
    title: string;
    content: React.ReactNode;
    icon: string;
    isActive: boolean;
    initialPosition?: Position;
    onClose: () => void;
    onActivate: () => void;
    children?: React.ReactNode;
}

export interface WindowData {
    id: number;
    title: string;
    content: React.ReactNode;
    icon: string;
    position: Position;
}

export interface Position {
    x: number;
    y: number;
}

export interface DragOffset {
    x: number;
    y: number;
}

export interface IconProps {
    id?: string;
    name: string;
    icon: string;
    onClick: (e: React.MouseEvent) => void;
}

export interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export interface DesktopProps {
    openWindow: (title: string, content: React.ReactNode, icon: string) => void;
    activeWindow: number | null;
    activateWindow: (id: number | null) => void;
}

export interface TaskbarProps {
    openWindows: WindowData[];
    startMenuOpen: boolean;
    toggleStartMenu: () => void;
    activeWindow: number | null;
    activateWindow: (id: number | null) => void;
}

export interface StartMenuProps {
    // Add any props needed for the start menu
}
