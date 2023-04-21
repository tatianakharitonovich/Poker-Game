import * as React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Button } from "../button/Button";
import { Player, SoundName } from "../../types";

import { getSound } from "../../utils/ui";

import "./ActionButtons.css";

export const ActionButtons: React.FC = observer(() => {
    const { loadedSounds, state, minBet, maxBet, betProcessor, buttonText } = useRootStore();
    const {
        players,
        activePlayerIndex,
        highBet,
        betInputValue,
    } = state;

    const { handleBetInputSubmit, handleFold } = betProcessor;

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
});
