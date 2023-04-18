import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../hooks/useRootStore";
import { SoundName, initialState } from "../types";
import { Button } from "./button/Button";

export const ExitButton: React.FC = observer(() => {
    const { loadedSounds, setIsSubmit, setWinner, setState } = useRootStore();

    const exitHandler = () => {
        setIsSubmit(false);
        setWinner(undefined);
        setState(initialState);
    };

    return (
        <Button
            className="exit-button secondary action-button"
            onClick={() => exitHandler()}
            sound={loadedSounds.find((sound) => sound.name === SoundName.negative)?.audio}
        >
            <img src="assets/images/exit.svg" alt="Exit" />
        </Button>
    );
});
