import * as React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { ActionButtons } from "./ActionButtons";

export const ActionButtonsContainer: React.FC = observer(() => {
    const { gameInfoStore, state, betProcessor, uiStore } = useRootStore();
    const {
        players,
        activePlayerIndex,
        highBet,
        betInputValue,
    } = state;

    const { handleBetInputSubmit, handleFold } = betProcessor;

    return (
        <ActionButtons
            loadedSounds={gameInfoStore.loadedSounds}
            minBet={gameInfoStore.minBet}
            maxBet={gameInfoStore.maxBet}
            players={players}
            buttonText={uiStore.buttonText}
            activePlayerIndex={activePlayerIndex}
            highBet={highBet}
            betInputValue={betInputValue}
            handleBetInputSubmit={handleBetInputSubmit}
            handleFold={handleFold}
        />
    );
});
