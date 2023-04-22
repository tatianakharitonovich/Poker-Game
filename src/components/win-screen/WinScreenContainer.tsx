import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Player } from "../../types";
import { WinScreen } from "./WinScreen";

interface WinScreenContainerProps {
    winner: Player | undefined;
}

export const WinScreenContainer: React.FC<WinScreenContainerProps> = observer(({ winner }) => {
    const { loadedSounds } = useRootStore();

    return (
        <WinScreen winner={winner} loadedSounds={loadedSounds} />
    );
});
