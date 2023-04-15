import React from "react";
import { RootStore, RootStoreContext } from "../stores/rootStore";

export function useRootStore(): RootStore {
    const context = React.useContext(RootStoreContext);
    if (!context) {
        throw new Error("Wrap element with context first!");
    }
    return context;
}
