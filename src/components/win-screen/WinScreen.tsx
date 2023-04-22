import React, { useEffect } from "react";
import { Player, Sound, SoundName } from "../../types";
import { useSound } from "../../hooks/useSound";
import { ExitButtonContainer } from "../exit-button/ExitButtonContainer";

import "./WinScreen.css";

interface WinScreenProps {
    winner: Player | undefined;
    loadedSounds: Sound[];
}

export const WinScreen: React.FC<WinScreenProps> = (props) => {
    const { winner, loadedSounds } = props;

    const finishSound = loadedSounds.find((sound) => sound.name === SoundName.finish)?.audio;

    const { playSound } = useSound(finishSound, true);

    if (finishSound) {
        finishSound.volume = 0.01;
    }

    useEffect(() => {
        playSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (winner) {
        return (
            <>
                <ExitButtonContainer />
                <h1 className="winscreen"> {winner.name} WIN! </h1>
            </>
        );
    }
    return null;
};
