import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { RegistrationForm } from "./RegistrationForm";

export const RegistrationFormContainer: React.FC = observer(() => {
    const {
        loadedSounds,
        userName,
        gender,
        playersNumber,
        setIsSubmit,
        setUserName,
        setGender,
        setPlayersNumber,
    } = useRootStore();

    return (
        <RegistrationForm
            loadedSounds={loadedSounds}
            userName={userName}
            gender={gender}
            playersNumber={playersNumber}
            setIsSubmit={setIsSubmit}
            setUserName={setUserName}
            setGender={setGender}
            setPlayersNumber={setPlayersNumber}
        />
    );
});
