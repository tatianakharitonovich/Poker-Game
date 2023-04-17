import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { GameState, PokerHand, ShowDownMessage, SoundName } from "../../types";
import { ShowdownMessage } from "../show-down-message/ShowdownMessage";
import { RankWinner } from "../rank-winner/RankWinner";
import { Button } from "../button/Button";
import { beginNextRound, checkWin } from "../../utils/players";

import "./Showdown.css";

interface ShowdownProps {
    renderCommunityCards: (clearAnimation: boolean, addClass: string) => JSX.Element[];
}

export const Showdown: React.FC<ShowdownProps> = observer(({ renderCommunityCards }) => {
    const {
        loadedSounds,
        state,
        setState,
        handleAI,
    } = useRootStore();

    const {
        showDownMessages,
        playerHierarchy,
    } = state;

    const finishSound = loadedSounds.find((sound) => sound.name === SoundName.finish)?.audio;

    if (finishSound) {
        finishSound.volume = 0.01;
        document.body.appendChild(finishSound);
    }

    useEffect(() => {
        setTimeout(() => {
            finishSound?.play().catch((e) => { throw new Error(`${e}`); });
        }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNextRound: () => void = () => {
        setState({ ...state, clearCards: true });
        const newState = beginNextRound(cloneDeep(state as GameState)) as GameState;
        if (checkWin(newState.players)) {
            setState({ ...state, winnerFound: true });
            return;
        }
        setState({ ...state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => handleAI(), 2000);
        }
    };

    const messageUnion = () => {
        const messageRes = showDownMessages.reduce((acc, message) => {
            acc.prize += message.prize;
            acc.rank = message.rank;
            acc.users = message.users;
            return acc;
        }, {
            prize: 0,
            rank: PokerHand.Flush,
            users: [],
        } as ShowDownMessage);

        return messageRes;
    };

    return (
        <div className="showdown">
            <img className="showdown-background" src="assets/images/showdown.svg" alt="LasVegas" />
            <div className="showdown-messages">
                <ShowdownMessage
                    message={messageUnion()}
                />
            </div>
            <div>
                <h5 className="showdown-cards-label">
                    Community Cards
                </h5>
                <div className="showdown-cards">
                    {renderCommunityCards(true, "showdown-card")}
                </div>
            </div>
            {
                playerHierarchy.map(itemHierarchy => {
                    const tie = Array.isArray(itemHierarchy);

                    return tie
                        ? (itemHierarchy)
                            .map(player => <RankWinner key={uuidv4()} player={player} />)
                        : <RankWinner key={uuidv4()} player={itemHierarchy} />;
                })
            }
            <Button
                className="action-button"
                onClick={() => handleNextRound()}
                sound={loadedSounds.find((sound) => sound.name === SoundName.positive)?.audio}
            >
                Next Round
            </Button>
        </div>
    );
});
