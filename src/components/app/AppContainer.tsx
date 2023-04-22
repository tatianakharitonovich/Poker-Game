import React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { App } from "./App";

export const AppContainer: React.FC = observer(function AppContainer() {
    const { loadedSounds, setLoadedSounds } = useRootStore();

    return (
        <App loadedSounds={loadedSounds} setLoadedSounds={setLoadedSounds} />
    );
});
