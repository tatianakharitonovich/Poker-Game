import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { PlayerStatus } from "./PlayerStatus";

interface PlayerStatusContainerProps {
    index: number;
    isActive: boolean;
    content: string | null;
}

export const PlayerStatusContainer: React.FC<PlayerStatusContainerProps> = observer((props) => {
    const { gameInfoStore: { loadedSounds }, gameLoopProcessor: { endTransition } } = useRootStore();
    const { index, isActive, content } = props;

    return (
        <PlayerStatus
            loadedSounds={loadedSounds}
            endTransition={endTransition}
            index={index}
            isActive={isActive}
            content={content}
        />
    );
});
