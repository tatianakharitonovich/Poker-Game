import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { RegistrationForm } from "./registration-form/RegistrationForm";
import { GameLayout } from "./GameLayout";
import { useRootStore } from "../hooks/useRootStore";

export const MainLayout: React.FC = observer(() => {
    const {
        isSubmit,
        setUserName,
        setGender,
        setPlayersNumber,
    } = useRootStore();

    useEffect(() => {
        setUserName("");
        setGender(undefined);
        setPlayersNumber("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmit]);

    return (
        <div className="App-wrap" style={{ height: isSubmit ? "100%" : "auto" }}>
            {!isSubmit ?
                <RegistrationForm />
                : <GameLayout />
            }
        </div>
    );
});
