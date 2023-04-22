import React, { useEffect } from "react";
import { Gender } from "../../types";
import { RegistrationFormContainer } from "../registration-form/RegistrationFormContainer";
import { GameLayoutContainer } from "../game-layout/GameLayoutContainer";

interface MainLayoutProps {
    isSubmit: boolean;
    setUserName: (name: string) => void;
    setGender: (gender: Gender | undefined) => void;
    setPlayersNumber: (number: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = (props) => {
    const {
        isSubmit,
        setUserName,
        setGender,
        setPlayersNumber,
    } = props;

    useEffect(() => {
        setUserName("");
        setGender(undefined);
        setPlayersNumber("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmit]);

    return (
        <div className="App-wrap" style={{ height: isSubmit ? "100%" : "auto" }}>
            {!isSubmit ?
                <RegistrationFormContainer />
                : <GameLayoutContainer />
            }
        </div>
    );
};
