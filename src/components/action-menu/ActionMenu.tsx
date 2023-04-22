import * as React from "react";
import { Handles, Rail, Slider, Tracks } from "react-compound-slider";
import { Handle } from "../slider/Handle";
import { railStyle, sliderStyle } from "../slider/styles";
import { Track } from "../slider/Track";

import "./ActionMenu.css";

interface ActionMenuProps {
    minBet: number;
    maxBet: number;
    isShow: boolean;
    handleBetInputChange: (val: readonly number[], maxBet: number) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
    const {
        minBet,
        maxBet,
        isShow,
        handleBetInputChange,
    } = props;

    return (
        <Slider
            rootStyle={sliderStyle(isShow)}
            domain={[minBet, maxBet === minBet ? minBet + 5 : maxBet]}
            values={[minBet]}
            step={5}
            onChange={(val) => handleBetInputChange(val, maxBet)}
            mode={2}
        >
            <Rail>
                {
                    ({ getRailProps }) => (
                        <div className="action-rail" style={railStyle} {...getRailProps()} />
                    )
                }
            </Rail>
            <Handles>
                {
                    ({ handles, getHandleProps }) => (
                        <div className="slider-handles">
                            {
                                handles.map(handle => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        getHandleProps={getHandleProps}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </Handles>
            <Tracks right={false}>
                {
                    ({ tracks, getTrackProps }) => (
                        <div className="slider-tracks">
                            {
                                tracks.map(
                                    ({ id, source, target }) => (
                                        <Track
                                            key={id}
                                            source={source}
                                            target={target}
                                            getTrackProps={getTrackProps}
                                        />
                                    ),
                                )
                            }
                        </div>
                    )
                }
            </Tracks>
        </Slider>
    );
};
