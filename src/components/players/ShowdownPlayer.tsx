import React from "react";
import { CardType, Sound } from "../../types";
import { Card } from "../cards/Card";
import { PlayerAvatar } from "./PlayerAvatar";

interface ShowdownPlayerProps {
    name: string;
    avatarURL: string;
    cards: CardType[];
    sounds: Sound[];
}

export const ShowdownPlayer: React.FC<ShowdownPlayerProps> = (props) => {
    const { name, avatarURL, cards, sounds } = props;

    return (
        <div className="player-wrap">
            <div className="player-wrap-avatar">
                <PlayerAvatar
                    avatarURL={avatarURL}
                    name={name}
                />
            </div>
            <div className="player-wrap-cards">
                <h5 className="player-wrap-cards-title">
                    Private Cards
                </h5>
                <div className="player-wrap-cards-content">
                    {cards.map((card) => {
                        const cardData = { ...card, animationDelay: 0 };
                        return (
                            <Card
                                key={`${card.cardRank}${card.suit}`}
                                cardData={cardData}
                                isRobot={false}
                                sounds={sounds}
                            />
                        );
                    },
                    )}
                </div>
            </div>
        </div>
    );
};
