import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { HierarchyPlayer, Player, ShowDownMessage } from "../../types";
import { ShowdownMessage } from "../show-down-message/ShowdownMessage";
import { RankWinner } from "../rank-winner/RankWinner";

import "./Showdown.css";

interface ShowdownProps {
    showDownMessages: ShowDownMessage[];
    renderCommunityCards: (clearAnimation: boolean) => JSX.Element[];
    playerHierarchy: HierarchyPlayer[];
    players: Player[];
    handleNextRound: () => void;
}

export const Showdown: React.FC<ShowdownProps> = (props) => {
    const {
        showDownMessages,
        renderCommunityCards,
        playerHierarchy,
        players,
        handleNextRound,
    } = props;

    return (
        <div className="showdown">
            <div className="showdown-messages">
                {showDownMessages.map((message) => (
                    <ShowdownMessage
                        key={uuidv4()}
                        message={message}
                    />
                ))}
            </div>
            <h5 className="showdown-cards-label">
                Community Cards
            </h5>
            <div className="showdown-cards">
                {renderCommunityCards(true)}
            </div>
            {
                playerHierarchy.map(itemHierarchy => {
                    const tie = Array.isArray(itemHierarchy);

                    return tie
                        ? (itemHierarchy as HierarchyPlayer[])
                            .map(player => <RankWinner key={uuidv4()} player={player} players={players} />)
                        : <RankWinner key={uuidv4()} player={itemHierarchy} players={players} />;
                })
            }
            <button className="showdown-button" onClick={() => handleNextRound()}> Next Round </button>
        </div>
    );
};
