import * as React from "react";
import { Handles, Rail, Slider, Tracks } from "react-compound-slider";
import { Phase, Player } from "../../types";
import { determineMinBet } from "../../utils/bet";
import { Handle } from "../slider/Handle";
import { railStyle, sliderStyle } from "../slider/styles";
import { Track } from "../slider/Track";

interface ActionMenuProps {
    players: Player[];
    activePlayerIndex: number;
    highBet: number;
    phase: Phase;
    handleBetInputChange: (val: readonly number[], max: number) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
    const {
        players,
        activePlayerIndex,
        highBet,
        phase,
        handleBetInputChange,
    } = props;

    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet);
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet;

    return (
        (phase === "betting1" || phase === "betting2" || phase === "betting3" || phase === "betting4") ?
            (players[activePlayerIndex].isFake) ? (<h4> {`Move: ${players[activePlayerIndex].name}`}</h4>) :
                players[activePlayerIndex].chips >= highBet ? (
                    <Slider
                        rootStyle={sliderStyle}
                        domain={[min, max]}
                        values={[min]}
                        step={1}
                        onChange={(val) => handleBetInputChange(val, max)}
                        mode={2}
                    >
                        <Rail>
                            {
                                ({ getRailProps }) => (
                                    <div style={railStyle} {...getRailProps()} />
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
                ) : null
            : null
    );
};
