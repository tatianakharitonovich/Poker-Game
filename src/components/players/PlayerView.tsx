import React from "react";
import { observer } from "mobx-react-lite";
import { Player } from "../../types";
import { Card } from "../cards/Card";
import { PlayerAvatar } from "./PlayerAvatar";
import { PlayerStatus } from "./PlayerStatus";

import "./PlayerView.css";
import { determineBestHand } from "../../utils/bestHand";
import { useRootStore } from "../../hooks/useRootStore";

const dealerChipImageURL = "/assets/images/chip.svg";
const playerBetImageURL = "./assets/images/bet.svg";

interface PlayerViewProps {
    arrayIndex: number;
    isActive: boolean;
    hasDealerChip: boolean;
    player: Player;
    endTransition: (index: number) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = observer((props) => {
    const {
        arrayIndex,
        endTransition,
        hasDealerChip,
        isActive,
        player: {
            isFake,
            folded,
            cards,
            avatarURL,
            name,
            chips,
            bet,
        },
    } = props;

    const { state } = useRootStore();

    const {
        playerAnimationSwitchboard,
        phase,
        clearCards,
        communityCards,
    } = state;

    const allCards = [...cards, ...communityCards];

    const playerCards = () => {
        let applyFoldedClassname: boolean;

        if (folded || clearCards) {
            applyFoldedClassname = true;
        }
        if (isFake) {
            return cards.map((card) => {
                if (phase !== "showdown") {
                    return (
                        <Card
                            key={`${card.cardRank}${card.suit}`}
                            cardData={card}
                            applyFoldedClassname={applyFoldedClassname}
                            isRobot={true}
                        />
                    );
                }
                const cardData = { ...card, animationDelay: 0 };
                return (
                    <Card
                        key={`${card.cardRank}${card.suit}`}
                        cardData={cardData}
                        applyFoldedClassname={applyFoldedClassname}
                        isRobot={false}
                    />
                );
            });
        }
        return cards.map((card) => {
            return (
                <Card
                    key={`${card.cardRank}${card.suit}`}
                    cardData={card}
                    applyFoldedClassname={applyFoldedClassname}
                    isRobot={false}
                />
            );
        });
    };

    const isAnimating = (playerBoxIndex: number) => {
        if (playerAnimationSwitchboard[playerBoxIndex].isAnimating) {
            return true;
        }
        return false;
    };

    return (
        <div
            data-test="player"
            className={`player player${arrayIndex}${(folded || clearCards) ? " skipping" : ""}`}
        >
            <PlayerStatus
                index={arrayIndex}
                isActive={isAnimating(arrayIndex)}
                content={playerAnimationSwitchboard[arrayIndex].content}
                endTransition={endTransition}
            />
            <div className="player-cards">
                {!isFake && phase !== "showdown" && !folded && <div className="player-cards-hand">{determineBestHand(allCards)}</div>}
                {playerCards()}
            </div>
            <div className="player-wrap">
                <div className="player-wrap-avatar">
                    <PlayerAvatar
                        avatarURL={avatarURL}
                        isActive={isActive}
                        name={name}
                    />
                    <div className="player-avatar-chips">
                        <h5>${`${chips}`}</h5>
                    </div>
                    <div className="player-avatar-bet">
                        <img className="player-avatar-bet-img" src={playerBetImageURL} alt="Player Bet" />
                        <h5>${bet}</h5>
                    </div>
                    {hasDealerChip &&
                    (
                        <div className="player-avatar-dealer">
                            <img src={dealerChipImageURL} alt="Dealer Chip" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
