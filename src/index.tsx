import React from "react";
import { createRoot } from "react-dom/client";
import { RootStoreContext, rootStore } from "./stores/rootStore";
import { AppContainer } from "./components/app/AppContainer";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!)
    .render(
        <RootStoreContext.Provider value={rootStore}>
            <AppContainer />
        </RootStoreContext.Provider>,
    );
