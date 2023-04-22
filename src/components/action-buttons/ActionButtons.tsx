import * as React from "react";
import { Button } from "../button/Button";
import { Player, PlayerBet, Sound, SoundName } from "../../types";

import { getSound } from "../../utils/ui";

import "./ActionButtons.css";

interface ActionButtonsProps {
    loadedSounds: Sound[];
    minBet: number;
    maxBet: number;
    buttonText: PlayerBet | undefined;
    players: Player[] | null;
    activePlayerIndex: number | null;
    highBet: number | null;
    betInputValue: number | null;
    handleBetInputSubmit: (bet: string, minBet: string, maxBet: string) => void;
    handleFold: () => void;

}

export const ActionButtons: React.FC<ActionButtonsProps> = (props) => {
    const {
        loadedSounds,
        minBet,
        maxBet,
        buttonText,
        players,
        activePlayerIndex,
        highBet,
        betInputValue,
        handleBetInputSubmit,
        handleFold,
    } = props;

    const button = () => {
        const sound = getSound(buttonText as string, loadedSounds);

        if (buttonText && (players as Player[])[activePlayerIndex as number].chips >= (highBet as number)) {
            return (
                <Button
                    className="action-button"
                    onClick={() => handleBetInputSubmit((betInputValue as number).toString(), minBet.toString(), maxBet.toString())}
                    sound={sound}
                >
                    {buttonText}
                </Button>
            );
        }
    };

    return (
        <>
            {button()}
            <Button
                className="action-button"
                onClick={() => handleFold()}
                sound={loadedSounds.find((sound) => sound.name === SoundName.fold)?.audio}
            >
                Fold
            </Button>
        </>
    );
};
