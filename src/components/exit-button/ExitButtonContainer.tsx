import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { ExitButton } from "./ExitButton";

export const ExitButtonContainer: React.FC = observer(() => {
    const { gameInfoStore: { loadedSounds }, gameLoopProcessor: { exitHandler } } = useRootStore();

    return (
        <ExitButton loadedSounds={loadedSounds} exitHandler={exitHandler} />
    );
});
