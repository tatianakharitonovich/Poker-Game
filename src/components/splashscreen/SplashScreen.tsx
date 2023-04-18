import React from "react";

import "./SplashScreen.css";
import { FullWave } from "./FullWave";
import { PartlyWave } from "./PartlyWave";

export const SplashScreen: React.FC = () => {
    return (
        <div className="splash-screen">
            <h1 className="splash-screen-title">
                Texas Hold&apos;em Poker
            </h1>
            <FullWave />
            <PartlyWave />
        </div>
    );
};
