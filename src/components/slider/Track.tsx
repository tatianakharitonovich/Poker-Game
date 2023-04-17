import React from "react";
import { GetTrackProps, SliderItem } from "react-compound-slider";

interface TrackProps {
    source: SliderItem;
    target: SliderItem;
    getTrackProps: GetTrackProps;
}

export const Track: React.FC<TrackProps> = ({ source, target, getTrackProps }) => {
    return (
        <div
            style={{
                position: "absolute",
                height: 7,
                zIndex: 1,
                marginTop: 35,
                boxShadow: "0 0 8px 0 #141212c9",
                backgroundImage: "linear-gradient(white, black)",
                borderRadius: 5,
                cursor: "pointer",
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()}
        />
    );
};
