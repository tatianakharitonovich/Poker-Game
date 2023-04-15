import React from "react";
import { CardType, Phase, Player, PlayerAnimationSwitchboard } from "../types";
import { PlayerView } from "./players/PlayerView";

interface BoardProps {
    players: Player[];
    activePlayerIndex: number;
    phase: Phase;
    dealerIndex: number;
    clearCards: boolean;
    communityCards: CardType[];
    playerAnimationSwitchboard: PlayerAnimationSwitchboard;
    popAnimationState: (index: number) => void;
}

export const Board: React.FC<BoardProps> = (props) => {
    const {
        players,
        activePlayerIndex,
        dealerIndex,
        clearCards,
        phase,
        communityCards,
        playerAnimationSwitchboard,
        popAnimationState,
    } = props;

    const reversedPlayers = players.reduce((result, player, index) => {
        const isActive = (index === activePlayerIndex);
        const hasDealerChip = (index === dealerIndex);
        result.unshift(
            <PlayerView
                key={player.id}
                arrayIndex={index}
                isActive={isActive}
                hasDealerChip={hasDealerChip}
                player={player}
                communityCards={communityCards}
                clearCards={clearCards}
                phase={phase}
                playerAnimationSwitchboard={playerAnimationSwitchboard}
                endTransition={popAnimationState}
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
