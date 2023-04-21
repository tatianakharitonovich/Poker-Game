import * as React from "react";
import { observer } from "mobx-react-lite";
import { Handles, Rail, Slider, Tracks } from "react-compound-slider";
import { Player } from "../../types";
import { determineMinBet } from "../../utils/bet";
import { Handle } from "../slider/Handle";
import { railStyle, sliderStyle } from "../slider/styles";
import { Track } from "../slider/Track";

import "./ActionMenu.css";
import { useRootStore } from "../../hooks/useRootStore";

export const ActionMenu: React.FC = observer(() => {
    const {
        betProcessor: {
            handleBetInputChange,
        },
        state: {
            players,
            activePlayerIndex,
            highBet,
            phase,
        },
    } = useRootStore();

    const isShow: () => boolean = () => {
        return (phase === "betting1" || phase === "betting2" || phase === "betting3" || phase === "betting4") &&
        (!(players as Player[])[activePlayerIndex as number].isFake) &&
        (players as Player[])[activePlayerIndex as number].chips >= (highBet as number);
    };

    const min = determineMinBet(
        highBet as number,
        (players as Player[])[activePlayerIndex as number].chips,
        (players as Player[])[activePlayerIndex as number].bet,
    );
    const max = (players as Player[])[activePlayerIndex as number].chips + (players as Player[])[activePlayerIndex as number].bet;

    return (
        <Slider
            rootStyle={sliderStyle(isShow())}
            domain={[min, max === min ? min + 5 : max]}
            values={[min]}
            step={5}
            onChange={(val) => handleBetInputChange(val, max)}
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
});
