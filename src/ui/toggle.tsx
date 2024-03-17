export type ToggleProps = {
    id?: string;
    classNames?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    color?: keyof typeof Colors;
    size?: keyof typeof Sizes;
    disabled?: boolean;
}

const Sizes = {
    xs: "d-toggle-xs",
    sm: "d-toggle-sm",
    md: "d-toggle-md",
    lg: "d-toggle-lg",
} as const;

const Colors = {
    primary: "d-toggle-primary",
    secondary: "d-toggle-secondary",
    accent: "d-toggle-accent",
    success: "d-toggle-success",
    warning: "d-toggle-warning",
    info: "d-toggle-info",
    error: "d-toggle-error",
} as const;

export function Toggle({ 
    id, 
    classNames, 
    checked, 
    onChange, 
    color,
    size,
    disabled 
}: ToggleProps): React.ReactElement {
    return (
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={e => onChange?.(e.target.checked)}
            className={`
                d-toggle
                ${classNames ?? ""} 
                ${size ? `${Sizes[size]}`: Sizes.xs} 
                ${color ? `${Colors[color]}`: Colors.primary}
            `}
            disabled={disabled}
        />
    );   
}
