import React from "react";
import { observer } from "mobx-react-lite";
import { Player } from "../types";
import { PlayerView } from "./players/PlayerView";
import { useRootStore } from "../hooks/useRootStore";

export const Board: React.FC = observer(() => {
    const { state } = useRootStore();

    const {
        players,
        activePlayerIndex,
        dealerIndex,
    } = state;

    const reversedPlayers = (players as Player[]).reduce((result, player, index) => {
        const isActive = (index === activePlayerIndex);
        const hasDealerChip = (index === dealerIndex);
        result.unshift(
            <PlayerView
                key={player.id}
                arrayIndex={index}
                isActive={isActive}
                hasDealerChip={hasDealerChip}
                player={player}
            />,
        );
        return result;
    }, [] as JSX.Element[]);

    return (
        <>
            {reversedPlayers.map(component => component)}
        </>
    );
});
