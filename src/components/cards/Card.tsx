import React, { useEffect } from "react";
import { CardType, Sound, SoundName, Suits } from "../../types";

import "./Card.css";

interface CardProps {
    cardData: CardType;
    applyFoldedClassname?: boolean;
    isRobot: boolean;
    addClass?: string;
    sounds: Sound[];
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
        sounds,
    } = props;

    const cardSound = sounds.find((sound) => sound.name === SoundName.card)?.audio;

    if (cardSound) {
        document.body.appendChild(cardSound);
    }

    useEffect(() => {
        setTimeout(() => {
            cardSound?.play().catch((e) => { throw new Error(`${e}`); });
        }, applyFoldedClassname ? 0 : animationDelay);
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
