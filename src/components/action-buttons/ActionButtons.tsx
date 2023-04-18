import * as React from "react";
import { observer } from "mobx-react-lite";
import { cloneDeep } from "lodash";
import { useRootStore } from "../../hooks/useRootStore";
import { Button } from "../button/Button";
import { GameStateBase, Player, PlayerWithSidePotStack, SoundName } from "../../types";
import {
    determineMinBet,
    handleBet,
    handleFold as handleFoldUtils,
} from "../../utils/bet";

import { getSound, renderActionButtonText } from "../../utils/ui";

import "./ActionButtons.css";

export const ActionButtons: React.FC = observer(() => {
    const { loadedSounds, state, pushAnimationState, setState, handleAI } = useRootStore();
    const {
        players,
        activePlayerIndex,
        highBet,
        betInputValue,
    } = state;

    const min = determineMinBet(
        highBet as number,
        (players as Player[])[activePlayerIndex as number].chips,
        (players as Player[])[activePlayerIndex as number].bet,
    ).toString();
    const max = (players as Player[])[activePlayerIndex as number].chips +
        (players as Player[])[activePlayerIndex as number].bet.toString();

    const handleBetInputSubmit: (bet: string, minBet: string, maxBet: string) => void =
        (bet: string, minBet: string, maxBet: string) => {
            const { playerAnimationSwitchboard, ...appState } = state;
            pushAnimationState(
                activePlayerIndex as number,
                `${renderActionButtonText(
                    highBet as number,
                    betInputValue as number,
                    (players as Player[])[activePlayerIndex as number],
                )} ${(+bet > (players as Player[])[activePlayerIndex as number].bet) ? (bet) : ""}`);
            const newState = handleBet(
                cloneDeep(appState as GameStateBase<Player>),
                parseInt(bet, 10),
                parseInt(minBet, 10),
                parseInt(maxBet, 10),
            ) as GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack>;
            setState({ ...state, ...newState });
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => {
                    handleAI();
                }, 2000);
            }
        };

    const handleFold: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = state;
        const newState = handleFoldUtils(cloneDeep(appState as GameStateBase<Player>));
        setState({ ...state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                handleAI();
            }, 2000);
        }
    };

    const button = () => {
        const buttonText = renderActionButtonText(
            highBet as number,
            betInputValue as number,
            (players as Player[])[activePlayerIndex as number],
        );
        const sound = getSound(buttonText as string, loadedSounds);

        if (buttonText && (players as Player[])[activePlayerIndex as number].chips >= (highBet as number)) {
            return (
                <Button
                    className="action-button"
                    onClick={() => handleBetInputSubmit((betInputValue as number).toString(), min, max)}
                    sound={sound}
                >
                    {buttonText}
                </Button>
            );
        }
    };

    return (
        <>
            {button()}
            <Button
                className="action-button"
                onClick={() => handleFold()}
                sound={loadedSounds.find((sound) => sound.name === SoundName.fold)?.audio}
            >
                Fold
            </Button>
        </>
    );
});
