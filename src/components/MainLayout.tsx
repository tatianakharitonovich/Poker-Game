import React, { useEffect, useState } from "react";
import { Gender, Sound } from "../types";
import { RegistrationForm } from "./registration-form/RegistrationForm";
import { GameLayout } from "./GameLayout";

interface MainLayoutProps {
    sounds: Sound[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sounds }) => {
    const [userName, setUserName] = useState("");
    const [playersNumber, setPlayersNumber] = useState<string>("");
    const [gender, setGender] = useState<Gender>();
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        setUserName("");
        setGender(undefined);
        setPlayersNumber("");
    }, [isSubmit]);

    return (
        <div className="App-wrap" style={{ height: isSubmit ? "100%" : "auto" }}>
            {!isSubmit ?
                (
                    <RegistrationForm
                        userName={userName}
                        gender={gender}
                        playersNumber={playersNumber}
                        userNameHandler={setUserName}
                        genderHandler={setGender}
                        playersNumberHandler={setPlayersNumber}
                        submitHandler={setIsSubmit}
                        sounds={sounds}
                    />
                )
                : (
                    <GameLayout
                        userName={userName}
                        gender={gender}
                        submitHandler={setIsSubmit}
                        sounds={sounds}
                        playersNumber={playersNumber}
                    />
                )
            }
        </div>
    );
};
