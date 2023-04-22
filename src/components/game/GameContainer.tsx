import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Game } from "./Game";

export const GameContainer: React.FC = observer(() => {
    const { loadedSounds, state } = useRootStore();

    const {
        players,
        activePlayerIndex,
        phase,
        pot,
        communityCards,
    } = state;

    return (
        <Game
            loadedSounds={loadedSounds}
            players={players}
            activePlayerIndex={activePlayerIndex}
            phase={phase}
            pot={pot}
            communityCards={communityCards}
        />
    );
});
