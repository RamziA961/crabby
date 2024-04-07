


type TextInput = {
    id?: string,
    classNames?: string,
    content?: string;
    size?: string;
    disabled?: boolean;
    bordered?: boolean;
}

const SIZES = {
    "xs": "d-input-xs",
    "sm": "d-input-sm",
    "md": "d-input-md",
    "lg": "d-input-lg",
} as const;
