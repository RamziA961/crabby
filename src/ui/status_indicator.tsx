import React from "react";

export enum Status {
    Online = "online",
    Offline = "offline",
    Error = "error",
}

export type StatusIndicatorProps = StatusIndicatorBaseProps & (StatusIndicatorStandardProps | StatusIndicatorCustomProps);

type StatusIndicatorBaseProps = {
    id?: string;
    classNames?: string;
    children: React.ReactElement;
}

type StatusIndicatorStandardProps = {
    content?: string;
    status: Status;
    indicatorClassNames?: string;
    verticalPosition?: keyof typeof VERTICAL_POSITION;
    horizontalPosition?: keyof typeof HORIZONTAL_POSITION;
}

type StatusIndicatorCustomProps = {
    badge?: React.ReactNode;
};

const HORIZONTAL_POSITION = {
    start: "d-indicator-start",
    center: "d-indicator-center",
    end: "d-indicator-end",
} as const;

const VERTICAL_POSITION = {
    top: "d-indicator-top",
    middle: "d-indicator-middle",
    bottom: "d-indicator-bottom",
} as const;

export function StatusIndicator(props: StatusIndicatorProps): React.ReactElement {
    const {
        id,
        classNames,
        children,
    } = props;

    return (
        <div id={id} className={`${classNames ?? ""} d-indicator`}>
            { isStatusIndicatorStandardProps(props) && 
                <span
                    className={
                        `d-indicator-item d-badge
                        ${VERTICAL_POSITION[props.verticalPosition ?? "top"]} 
                        ${HORIZONTAL_POSITION[props.horizontalPosition ?? "end"]}
                        ${props.status === Status.Online ? "d-badge-success" : ""}
                        ${props.status === Status.Offline ? "d-badge-warning" : ""}
                        ${props.status === Status.Error ? "d-badge-error" : ""}
                        ${props.indicatorClassNames ?? ""}
                        `
                    }
                > 
                    { props.content }
                </span>
            }
            { isStatusIndicatorCustomProps(props) && props.badge }
            { children }
        </div>
    );
}


function isStatusIndicatorStandardProps(props: StatusIndicatorProps): props is StatusIndicatorBaseProps & StatusIndicatorStandardProps {
    return "status" in props;
}

function isStatusIndicatorCustomProps(props: StatusIndicatorProps): props is StatusIndicatorBaseProps & StatusIndicatorCustomProps {
    return !isStatusIndicatorStandardProps(props);
}

