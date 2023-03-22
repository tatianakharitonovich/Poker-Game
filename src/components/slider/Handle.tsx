import React from "react";
import { GetHandleProps, SliderItem } from "react-compound-slider";

interface HandleProps {
    handle: SliderItem;
    getHandleProps: GetHandleProps;
}

export const Handle: React.FC<HandleProps> = (props) => {
    const {
        handle: { id, value, percent },
        getHandleProps,
    } = props;
    return (
        <div
            style={{
                left: `${percent}%`,
                position: "absolute",
                marginLeft: -4,
                marginTop: 31,
                zIndex: 2,
                width: 16,
                height: 16,
                border: "1px solid black",
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "50%",
                backgroundImage: "radial-gradient(rgb(239, 239, 239), rgb(80, 71, 71))",
                color: "#aaa",
            }}
            {...getHandleProps(id)}
        >
            <div
                style={{
                    display: "flex",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.95)",
                    justifyContent: "center",
                    fontSize: 16,
                    marginTop: 18,
                }}
            >
                {value}
            </div>
        </div>
    );
};
