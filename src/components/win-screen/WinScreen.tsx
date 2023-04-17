import React from "react";
import { Player } from "../../types";

import "./WinScreen.css";

interface WinScreenProps {
    winner: Player | undefined;
}

export const WinScreen: React.FC<WinScreenProps> = ({ winner }) => {
    if (winner) {
        return (
            <h1 className="winscreen"> {winner.name} Win! </h1>
        );
    }
    return null;
};
