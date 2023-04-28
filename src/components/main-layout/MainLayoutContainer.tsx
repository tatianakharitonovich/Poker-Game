import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { MainLayout } from "./MainLayout";

export const MainLayoutContainer: React.FC = observer(() => {
    const {
        isSubmit,
        setUserName,
        setGender,
        setPlayersNumber,
    } = useRootStore().gameInfoStore;

    return (
        <MainLayout
            isSubmit={isSubmit}
            setUserName={setUserName}
            setGender={setGender}
            setPlayersNumber={setPlayersNumber}
        />
    );
});
