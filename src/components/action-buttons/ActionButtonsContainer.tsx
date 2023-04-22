import * as React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { ActionButtons } from "./ActionButtons";

export const ActionButtonsContainer: React.FC = observer(() => {
    const { loadedSounds, state, minBet, maxBet, betProcessor, buttonText } = useRootStore();
    const {
        players,
        activePlayerIndex,
        highBet,
        betInputValue,
    } = state;

    const { handleBetInputSubmit, handleFold } = betProcessor;

    return (
        <ActionButtons
            loadedSounds={loadedSounds}
            minBet={minBet}
            maxBet={maxBet}
            players={players}
            buttonText={buttonText}
            activePlayerIndex={activePlayerIndex}
            highBet={highBet}
            betInputValue={betInputValue}
            handleBetInputSubmit={handleBetInputSubmit}
            handleFold={handleFold}
        />
    );
});
