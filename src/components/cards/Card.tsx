import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { CardType, SoundName, Suits } from "../../types";

import "./Card.css";
import { useSound } from "../../hooks/useSound";

interface CardProps {
    cardData: CardType;
    applyFoldedClassname?: boolean;
    isRobot: boolean;
    addClass?: string;
}

export const Card: React.FC<CardProps> = observer((props) => {
    const { loadedSounds } = useRootStore();
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

    const cardSound = loadedSounds.find((sound) => sound.name === SoundName.card)?.audio;

    const { playSound } = useSound(cardSound, true);

    useEffect(() => {
        setTimeout(() => {
            playSound();
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
            className={`playing-card${isRobot ? " isFakecard" : ""}${applyFoldedClassname ? " folded" : ""} ${addClass || ""}`}
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
});
