import React from "react";
import { Sound, SoundName } from "../../types";
import { Button } from "../button/Button";

interface ExitButtonProps {
    loadedSounds: Sound[];
    exitHandler: () => void;
}

export const ExitButton: React.FC<ExitButtonProps> = (props) => {
    const { loadedSounds, exitHandler } = props;

    return (
        <Button
            className="exit-button secondary action-button"
            onClick={() => exitHandler()}
            sound={loadedSounds.find((sound) => sound.name === SoundName.negative)?.audio}
        >
            <img src="assets/images/exit.svg" alt="Exit" />
        </Button>
    );
};
