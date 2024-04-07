import React from "react"

export function useClickAway<T extends HTMLElement>(
    callback: (event?: MouseEvent) => void
): React.RefObject<T> {
    const ref = React.useRef<T>(null);

    React.useEffect(() => {
        const handleClick = (e: MouseEvent): any => {
            if(ref.current && e.target && !ref.current.contains(e.target as Node)) {
                callback(e);       
            }
        }
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        }

    }, [callback, ref]);

    return ref;
}
