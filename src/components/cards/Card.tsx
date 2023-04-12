import React, { useEffect, useState } from "react";
import { CardType, Suits } from "../../types";

import "./Card.css";

interface CardProps {
    cardData: CardType;
    applyFoldedClassname?: boolean;
    isRobot: boolean;
    addClass?: string;
}

export const Card: React.FC<CardProps> = (props) => {
    const {
        cardData: {
            suit,
            cardRank,
            animationDelay,
        },
        applyFoldedClassname,
        isRobot,
        addClass,
    } = props;

    const [audio] = useState(new Audio("assets/sounds/card.mp3"));
    document.body.appendChild(audio);

    useEffect(() => {
        // audio.play().catch((e) => { throw new Error(`${e}`); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderUnicodeSuitSymbol = (suitCard: Suits[keyof Suits]) => {
        switch (suitCard) {
            case ("Heart"): return "\u2665";
            case ("Diamond"): return "\u2666";
            case ("Spade"): return "\u2660";
            case ("Club"): return "\u2663";
            default: throw Error("Unfamiliar String Recieved in Suit Unicode Generation");
        }
    };

    return (
        <div
            key={`${suit} ${cardRank}`}
            className={`playing-card${isRobot ? " isFakecard" : ""}${applyFoldedClassname ? " folded" : ""} ${addClass}`}
            style={{ animationDelay: `${(applyFoldedClassname) ? 0 : animationDelay}ms` }}
        >
            {!isRobot && (
                <h5
                    style={{ color: `${(suit === "Diamond" || suit === "Heart") ? "red" : "black"}` }}
                >
                    {`${cardRank} ${renderUnicodeSuitSymbol(suit)}`}
                </h5>
            )}
        </div>
    );
};
