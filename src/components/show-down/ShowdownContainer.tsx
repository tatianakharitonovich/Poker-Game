import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Showdown } from "./Showdown";

interface ShowdownContainerProps {
    renderCommunityCards: (clearAnimation: boolean, addClass: string) => JSX.Element[];
}

export const ShowdownContainer: React.FC<ShowdownContainerProps> = observer(({ renderCommunityCards }) => {
    const {
        gameInfoStore: {
            loadedSounds,
        },
        state,
        gameLoopProcessor: {
            handleNextRound,
        },
    } = useRootStore();

    const {
        showDownMessages,
        playerHierarchy,
    } = state;

    return (
        <Showdown
            renderCommunityCards={renderCommunityCards}
            loadedSounds={loadedSounds}
            handleNextRound={handleNextRound}
            showDownMessages={showDownMessages}
            playerHierarchy={playerHierarchy}
        />
    );
});
