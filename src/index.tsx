import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { RootStoreContext, rootStore } from "./stores/rootStore";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!)
    .render(
        <RootStoreContext.Provider value={rootStore}>
            <App />
        </RootStoreContext.Provider>,
    );
