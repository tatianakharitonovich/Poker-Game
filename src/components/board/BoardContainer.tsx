import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Board } from "./Board";

export const BoardContainer: React.FC = observer(() => {
    const { state } = useRootStore();

    const {
        players,
        activePlayerIndex,
        dealerIndex,
    } = state;

    return (
        <Board
            players={players}
            activePlayerIndex={activePlayerIndex}
            dealerIndex={dealerIndex}
        />
    );
});
