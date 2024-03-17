import React from "react";

export type ButtonProps = {
    id?: string;
    classNames?: string;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onHover?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    color?: keyof typeof Colors;
    size?: keyof typeof Sizes;
    outline?: boolean;
    disabled?: boolean;
    iconProps?: IconProps;
    children?: string;
}

type IconProps = {
    icon: React.ReactElement;
    iconPosition: "start" | "end";
}

const Sizes = {
    xs: "d-btn-xs",
    sm: "d-btn-sm",
    md: "d-btn-md",
    lg: "d-btn-lg",
} as const;

const Colors = {
    primary: "d-btn-primary",
    secondary: "d-btn-secondary",
    accent: "d-btn-accent",
    success: "d-btn-success",
    warning: "d-btn-warning",
    info: "d-btn-info",
    error: "d-btn-error",
    neutral: "d-btn-neutral",
    ghost: "d-btn-ghost",
    link: "d-btn-link",
} as const;

export function Button({ 
    id, 
    classNames, 
    onClick, 
    onHover, 
    color, 
    size, 
    outline, 
    disabled, 
    iconProps,
    children 
}: ButtonProps): React.ReactElement {
    return (
        <button
            id={id}
            onClick={onClick}
            onMouseEnter={onHover}
            disabled={disabled}
            className={`
                d-btn 
                ${classNames ?? ""}
                ${color ? `${Colors[color]}` : Colors.neutral}
                ${size ? `${Sizes[size]}` : Sizes.sm}
                ${outline ? "d-btn-outline" : ""}
                ${disabled ? "d-btn-disabled" : ""}
            `}
        >
            { iconProps?.iconPosition === "start" && iconProps?.icon }
            { children }
            { iconProps?.iconPosition === "end" && iconProps?.icon }
        </button>
    );
}
