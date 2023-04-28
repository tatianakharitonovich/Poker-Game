/* eslint-disable import/no-cycle */
import React from "react";
import { makeAutoObservable } from "mobx";
import { cloneDeep } from "lodash";
import {
    GameStateBase,
    GameStateInit,
    Player,
    PlayerWithSidePotStack,
    initialState,
} from "../types";

import {
    handleAI as handleAIUtil,
} from "../utils/ai";
import { BetProcessor } from "./betProcessor";
import { GameLoopProcessor } from "./gameLoopProcessor";
import { GameInfoStore } from "./gameInfoStore";
import { UIStore } from "./uiStore";

export class RootStore {
    public state: GameStateInit = initialState;
    public betProcessor: BetProcessor;
    public gameLoopProcessor: GameLoopProcessor;
    public gameInfoStore: GameInfoStore;
    public uiStore: UIStore;

    public constructor() {
        // make class instance and needed fields observable
        makeAutoObservable(this, {}, { autoBind: true });
        this.betProcessor = new BetProcessor(this);
        this.gameLoopProcessor = new GameLoopProcessor(this);
        this.gameInfoStore = new GameInfoStore(this);
        this.uiStore = new UIStore(this);
    }

    public setState: (newState: GameStateInit) => void = (newState: GameStateInit) => {
        this.state = { ...this.state, ...newState };
    };

    public handleAI: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = this.state;
        const newState =
            handleAIUtil(
                cloneDeep(appState as GameStateBase<Player>),
                this.uiStore.pushAnimationState,
            ) as GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack>;
        this.setState({
            ...this.state,
            ...newState,
            betInputValue: newState.minBet,
        });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                this.handleAI();
            }, 2000);
        }
    };
}

export const RootStoreContext = React.createContext<RootStore | null>(null);
export const rootStore = new RootStore();
