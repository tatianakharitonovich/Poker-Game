import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { CardType } from "../../types";
import { Card } from "./Card";

interface CardContainerProps {
    cardData: CardType;
    applyFoldedClassname?: boolean;
    isRobot: boolean;
    addClass?: string;
}

export const CardContainer: React.FC<CardContainerProps> = observer((props) => {
    const { loadedSounds } = useRootStore().gameInfoStore;
    const {
        cardData,
        applyFoldedClassname,
        isRobot,
        addClass,
    } = props;

    return (
        <Card
            loadedSounds={loadedSounds}
            cardData={cardData}
            applyFoldedClassname={applyFoldedClassname}
            isRobot={isRobot}
            addClass={addClass}
        />
    );
});
