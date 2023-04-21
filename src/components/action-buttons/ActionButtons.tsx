import * as React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Button } from "../button/Button";
import { Player, SoundName } from "../../types";
import { determineMinBet } from "../../utils/bet";

import { getSound, renderActionButtonText } from "../../utils/ui";

import "./ActionButtons.css";

export const ActionButtons: React.FC = observer(() => {
    const { loadedSounds, state, betProcessor } = useRootStore();
    const {
        players,
        activePlayerIndex,
        highBet,
        betInputValue,
    } = state;

    const { handleBetInputSubmit, handleFold } = betProcessor;

    const min = determineMinBet(
        highBet as number,
        (players as Player[])[activePlayerIndex as number].chips,
        (players as Player[])[activePlayerIndex as number].bet,
    ).toString();
    const max = (players as Player[])[activePlayerIndex as number].chips +
        (players as Player[])[activePlayerIndex as number].bet.toString();

    const button = () => {
        const buttonText = renderActionButtonText(
            highBet as number,
            betInputValue as number,
            (players as Player[])[activePlayerIndex as number],
        );
        const sound = getSound(buttonText as string, loadedSounds);

        if (buttonText && (players as Player[])[activePlayerIndex as number].chips >= (highBet as number)) {
            return (
                <Button
                    className="action-button"
                    onClick={() => handleBetInputSubmit((betInputValue as number).toString(), min, max)}
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
});
