import React from "react";
import { observer } from "mobx-react-lite";
import { Player } from "../../types";
import { useRootStore } from "../../hooks/useRootStore";
import { PlayerView } from "./PlayerView";

interface PlayerViewContainerProps {
    arrayIndex: number;
    isActive: boolean;
    hasDealerChip: boolean;
    player: Player;
}

export const PlayerViewContainer: React.FC<PlayerViewContainerProps> = observer((props) => {
    const {
        arrayIndex,
        hasDealerChip,
        isActive,
        player,
    } = props;

    const { state } = useRootStore();

    const {
        playerAnimationSwitchboard,
        phase,
        clearCards,
        communityCards,
    } = state;

    return (
        <PlayerView
            arrayIndex={arrayIndex}
            hasDealerChip={hasDealerChip}
            isActive={isActive}
            player={player}
            playerAnimationSwitchboard={playerAnimationSwitchboard}
            phase={phase}
            clearCards={clearCards}
            communityCards={communityCards}
        />
    );
});
