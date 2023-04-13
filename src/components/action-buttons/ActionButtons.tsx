import * as React from "react";
import { Player, Sound, SoundName } from "../../types";
import { determineMinBet } from "../../utils/bet";
import { getSound, renderActionButtonText } from "../../utils/ui";

import "./ActionButtons.css";
import { Button } from "../button/Button";

interface ActionButtonsProps {
    players: Player[];
    activePlayerIndex: number;
    highBet: number;
    betInputValue: number;
    sounds: Sound[];
    handleFold: () => void;
    handleBetInputSubmit: (bet: string, min: string, max: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = (props) => {
    const {
        players,
        activePlayerIndex,
        highBet,
        handleBetInputSubmit,
        betInputValue,
        handleFold,
        sounds,
    } = props;

    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet).toString();
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet.toString();

    const button = () => {
        const buttonText = renderActionButtonText(highBet, betInputValue, players[activePlayerIndex]);
        const sound = getSound(buttonText as string, sounds);

        if (buttonText && players[activePlayerIndex].chips >= highBet) {
            return (
                <Button
                    className="action-button"
                    onClick={() => handleBetInputSubmit(betInputValue.toString(), min, max)}
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
                sound={sounds.find((sound) => sound.name === SoundName.fold)?.audio}
            >
                Fold
            </Button>
        </>
    );
};
