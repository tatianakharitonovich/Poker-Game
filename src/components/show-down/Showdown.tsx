import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { HierarchyPlayer, Player, PokerHand, ShowDownMessage, Sound, SoundName } from "../../types";
import { ShowdownMessage } from "../show-down-message/ShowdownMessage";
import { RankWinner } from "../rank-winner/RankWinner";

import "./Showdown.css";
import { Button } from "../button/Button";

interface ShowdownProps {
    showDownMessages: ShowDownMessage[];
    renderCommunityCards: (clearAnimation: boolean, addClass: string) => JSX.Element[];
    playerHierarchy: HierarchyPlayer[] | HierarchyPlayer[][];
    players: Player[];
    sounds: Sound[];
    handleNextRound: () => void;
}

export const Showdown: React.FC<ShowdownProps> = (props) => {
    const {
        showDownMessages,
        renderCommunityCards,
        playerHierarchy,
        players,
        sounds,
        handleNextRound,
    } = props;

    const finishSound = sounds.find((sound) => sound.name === SoundName.finish)?.audio;

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
                {showDownMessages.map((message) => (
                    <ShowdownMessage
                        key={uuidv4()}
                        message={message}
                    />
                ))}
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
                            .map(player => <RankWinner key={uuidv4()} sounds={sounds} player={player} players={players} />)
                        : <RankWinner key={uuidv4()} sounds={sounds} player={itemHierarchy} players={players} />;
                })
            }
            <Button
                className="action-button"
                data-testid="form-save-button"
                onClick={() => handleNextRound()}
                sound={sounds.find((sound) => sound.name === SoundName.positive)?.audio}
            >
                Next Round
            </Button>
        </div>
    );
};
