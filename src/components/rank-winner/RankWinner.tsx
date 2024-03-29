import * as React from "react";
import { HierarchyPlayer, Player } from "../../types";
import { ShowdownPlayer } from "../players/ShowdownPlayer";
import { CardContainer } from "../cards/CardContainer";

import "./RankWinner.css";

interface RankWinnerProps {
    player: HierarchyPlayer;
    players: Player[] | null;
}

export const RankWinner: React.FC<RankWinnerProps> = (props) => {
    const { players, player } = props;
    const { name, bestHand, handRank } = player;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const playerStateData = (players as Player[]).find(statePlayer => statePlayer.name === name)!;

    const netChipEarnings = (playerStateData.roundEndChips - playerStateData.roundStartChips);
    const win = (netChipEarnings > 0);
    const none = (netChipEarnings === 0);

    return (
        <div className="rank-winner">
            <ShowdownPlayer
                name={name}
                avatarURL={playerStateData.avatarURL}
                cards={playerStateData.cards}
            />
            <div className="rank-winner-besthand">
                <h5>
                    BEST HAND
                </h5>
                <div className="rank-winner-besthand-cards" style={{ alignItems: "center" }}>
                    {
                    bestHand.map((card) => {
                        const cardData = { ...card, animationDelay: 0 };
                        return (
                            <CardContainer
                                key={`${card.cardRank}${card.suit}`}
                                cardData={cardData}
                                isRobot={false}
                                addClass="showdown-card"
                            />
                        );
                    })
                    }
                </div>
            </div>
            <div>
                <div className="rank-winner-handrank">
                    {handRank}
                </div>
                <div className={`rank-winner-earnings ${(win) ? ("positive") : (none) ? ("") : ("negative")}`}>
                    {`${(win) ? ("+") : ("")}${netChipEarnings}`}
                </div>
            </div>
        </div>
    );
};
