import React from "react";

export type SliderProps = {
    id?: string;
    classNames?: string;
    value?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
    color?: keyof typeof COLORS;
    size?: keyof typeof SIZES;
    disabled?: boolean;
}

const SIZES = {
    xs: "d-range-xs",
    sm: "d-range-sm",
    md: "d-range-md",
    lg: "d-range-lg",
} as const;

const COLORS = {
    primary: "d-range-rimary",
    secondary: "d-range-secondary",
    accent: "d-range-accent",
    success: "d-range-success",
    warning: "d-range-warning",
    info: "d-range-info",
    error: "d-range-error",
} as const;

export function Slider({ 
    id, 
    classNames, 
    value, 
    min, 
    max, 
    onChange,
    color,
    size,
    disabled
}: SliderProps): React.ReactElement {
    return (
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className={`
                d-range
                ${classNames ?? ""} 
                ${size ? `${SIZES[size]}`: SIZES.xs} 
                ${color ? `${COLORS[color]}`: COLORS.primary}
            `}
            disabled={disabled}
        />
    );
}
