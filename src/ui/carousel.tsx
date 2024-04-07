import React from "react";

export enum CarouselDirection {
    Vertical = "vertical",
    Horizontal = "horizontal"
}

export type CarouselProps = {
    id?: string;
    classNames?: string;
    direction?: CarouselDirection;
    threshold?: number;
    selectedChild?: number;
    onSettled?: (index: number) => void;
    disabled?: boolean;
    children: React.ReactElement[];
}

export function Carousel({
    id,
    classNames = "",
    direction = CarouselDirection.Vertical,
    threshold = 7,
    selectedChild = 0,
    onSettled,
    disabled = false,
    children
}: CarouselProps): React.ReactElement {
    const style: React.CSSProperties = React.useMemo(() => {
        const base = {
            transition: "transform 0.5s"
        };
        const transform = {
            transform: direction === CarouselDirection.Vertical ?
                `translate(0, calc(100vh * ${selectedChild} * -1)`
                :
                `translate(calc(100vw * ${selectedChild} * -1), 0)`,
            };

        const dim = direction === CarouselDirection.Vertical ? 
            { height: `calc(100vh * ${children.length})` }
            :
            { width: `calc(100vw * ${children.length})`};

        return {
            ...base,
            ...transform,
            ...dim,
        };
    }, [selectedChild, direction, children.length]);

    const directionClasses = React.useMemo(() =>
        `${
            direction === CarouselDirection.Vertical  ? "flex-col items-center" : "flex-row justify-center"
        }`,
        [direction]
    );

    const onScroll = React.useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        const delta = direction === CarouselDirection.Vertical ? e.deltaY : e.deltaX;
        const dir = delta > 0 ? 1 : -1;
        const nextIndex = dir === 1 ? 
            Math.min(children.length, selectedChild + 1) : 
            Math.max(0, selectedChild - 1);

        if(Math.abs(delta) < threshold) {
            return;
        }
        
        onSettled?.(nextIndex);
    }, [
            threshold, 
            selectedChild,
            onSettled,
            children.length
        ]
    );

    return (
        <div 
            id={id}
            onWheel={disabled ? () => {} : onScroll}
            className={
                `${classNames}
                ${directionClasses}
                flex overflow-hidden`
            }
            style={style}
        >
            { children }
        </div>
    );
}
