import * as React from "react";
import { observer } from "mobx-react-lite";
import { HierarchyPlayer } from "../../types";
import { useRootStore } from "../../hooks/useRootStore";
import { RankWinner } from "./RankWinner";

interface RankWinnerContainerProps {
    player: HierarchyPlayer;
}

export const RankWinnerContainer: React.FC<RankWinnerContainerProps> = observer(({ player }) => {
    const {
        state:
        { players },
    } = useRootStore();

    return (
        <RankWinner players={players} player={player} />
    );
});
