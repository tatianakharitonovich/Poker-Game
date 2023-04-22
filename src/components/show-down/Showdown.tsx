import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { HierarchyPlayer, PokerHand, ShowDownMessage, Sound, SoundName } from "../../types";
import { ShowdownMessage } from "../show-down-message/ShowdownMessage";
import { Button } from "../button/Button";
import { useSound } from "../../hooks/useSound";
import { RankWinnerContainer } from "../rank-winner/RankWinnerContainer";

import "./Showdown.css";

interface ShowdownProps {
    renderCommunityCards: (clearAnimation: boolean, addClass: string) => JSX.Element[];
    handleNextRound: () => void;
    loadedSounds: Sound[];
    showDownMessages: ShowDownMessage[];
    playerHierarchy: HierarchyPlayer[] | HierarchyPlayer[][];
}

export const Showdown: React.FC<ShowdownProps> = (props) => {
    const {
        renderCommunityCards,
        loadedSounds,
        handleNextRound,
        showDownMessages,
        playerHierarchy,
    } = props;

    const finishSound = loadedSounds.find((sound) => sound.name === SoundName.finish)?.audio;

    const { playSound } = useSound(finishSound, true);

    if (finishSound) {
        finishSound.volume = 0.01;
    }

    useEffect(() => {
        setTimeout(() => {
            playSound();
        }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            .map(player => <RankWinnerContainer key={uuidv4()} player={player} />)
                        : <RankWinnerContainer key={uuidv4()} player={itemHierarchy} />;
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
};
