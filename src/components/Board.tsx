import React from "react";
import { CardType, Phase, Player, PlayerAnimationSwitchboard, Sound } from "../types";
import { PlayerView } from "./players/PlayerView";

interface BoardProps {
    players: Player[];
    activePlayerIndex: number;
    phase: Phase;
    dealerIndex: number;
    clearCards: boolean;
    communityCards: CardType[];
    playerAnimationSwitchboard: PlayerAnimationSwitchboard;
    sounds: Sound[];
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
        sounds,
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
                sounds={sounds}
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
