import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Player, SoundName } from "../../types";

import "./WinScreen.css";
import { ExitButton } from "../ExitButton";

interface WinScreenProps {
    winner: Player | undefined;
}

export const WinScreen: React.FC<WinScreenProps> = observer(({ winner }) => {
    const { loadedSounds } = useRootStore();

    const finishSound = loadedSounds.find((sound) => sound.name === SoundName.finish)?.audio;

    if (finishSound) {
        finishSound.volume = 0.01;
        document.body.appendChild(finishSound);
    }

    useEffect(() => {
        finishSound?.play().catch((e) => { throw new Error(`${e}`); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (winner) {
        return (
            <>
                <ExitButton />
                <h1 className="winscreen"> {winner.name} WIN! </h1>
            </>
        );
    }
    return null;
});
