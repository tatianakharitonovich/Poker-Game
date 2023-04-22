import React from "react";
import { Player } from "../../types";
import { PlayerViewContainer } from "../players/PlayerViewContainer";

interface BoardProps {
    players: Player[] | null;
    activePlayerIndex: number | null;
    dealerIndex: number | null;
}

export const Board: React.FC<BoardProps> = (props) => {
    const {
        players,
        activePlayerIndex,
        dealerIndex,
    } = props;

    const reversedPlayers = (players as Player[]).reduce((result, player, index) => {
        const isActive = (index === activePlayerIndex);
        const hasDealerChip = (index === dealerIndex);
        result.unshift(
            <PlayerViewContainer
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
};
