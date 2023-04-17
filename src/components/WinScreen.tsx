import React from "react";
import { Player } from "../types";

import "./WinScreen.css";

interface WinScreenProps {
    winners: Player[] | undefined;
}

export const WinScreen: React.FC<WinScreenProps> = ({ winners }) => {
    if (winners) {
        return (
            <h1 className="winscreen"> {winners.map(winner => winner.name).join()} Win! </h1>
        );
    }
    return null;
};
