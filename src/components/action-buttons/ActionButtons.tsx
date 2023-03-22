import * as React from "react";
import { Player } from "../../types";
import { determineMinBet } from "../../utils/bet";
import { renderActionButtonText } from "../../utils/ui";

import "./ActionButtons.css";

interface ActionButtonsProps {
    players: Player[];
    activePlayerIndex: number;
    highBet: number;
    betInputValue: number;
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
    } = props;

    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet).toString();
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet.toString();

    const button = () => {
        const buttonText = renderActionButtonText(highBet, betInputValue, players[activePlayerIndex]);

        if (buttonText && players[activePlayerIndex].chips >= highBet) {
            return (
                <button className="action-button" onClick={() => handleBetInputSubmit(betInputValue.toString(), min, max)}>
                    {buttonText}
                </button>
            );
        }
    };

    return (
        <>
            {button()}
            <button className="action-button" onClick={() => handleFold()}>
                Fold
            </button>
        </>
    );
};
