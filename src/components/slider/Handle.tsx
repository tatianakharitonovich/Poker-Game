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
                marginTop: 27,
                zIndex: 2,
                width: 20,
                height: 20,
                border: "1px solid black",
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "50%",
                backgroundImage: "radial-gradient(rgb(239, 239, 239), rgb(80, 71, 71))",
                boxShadow: "0 0px 8px 0px #141212c9",
                color: "#aaa",
            }}
            {...getHandleProps(id)}
        >
            <div
                style={{
                    display: "flex",
                    background: "rgba(0,0,0,0.70)",
                    justifyContent: "center",
                    borderRadius: 8,
                    padding: 4,
                    fontSize: 24,
                    marginTop: 21,
                    width: "min-content",
                    boxShadow: "0 0px 8px 0px #141212c9",
                }}
            >
                {value}
            </div>
        </div>
    );
};
