import React from 'react';

export type IconButtonProps = {
    id?: string;
    classNames?: string;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onHover?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    color?: keyof typeof COLORS;
    size?: keyof typeof SIZES;
    outline?: boolean;
    disabled?: boolean;
    children?: React.ReactElement;
}

const SIZES = {
    xs: "d-btn-xs",
    sm: "d-btn-sm",
    md: "d-btn-md",
    lg: "d-btn-lg",
} as const;

const COLORS = {
    primary: "d-btn-primary",
    secondary: "d-btn-secondary",
    accent: "d-btn-accent",
    success: "d-btn-success",
    warning: "d-btn-warning",
    info: "d-btn-info",
    error: "d-btn-error",
    neutral: "d-btn-neutral",
    ghost: "d-btn-ghost",
} as const;

export function IconButton({ 
    id, 
    classNames, 
    onClick, 
    onHover, 
    color, 
    size, 
    outline, 
    disabled, 
    children 
}: IconButtonProps): React.ReactElement {
    return (
        <button
            id={id}
            onClick={onClick}
            onMouseEnter={onHover}
            disabled={disabled}
            className={`
                d-btn 
                ${classNames ?? ""}
                ${color ? `${COLORS[color]}` : COLORS.neutral}
                ${size ? `${SIZES[size]}` : SIZES.sm}
                ${outline ? "d-btn-outline" : ""}
                ${disabled ? "d-btn-disabled" : ""}
            `}
        >
            { children }
        </button>
    );
}

