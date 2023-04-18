import React from "react";
import { makeAutoObservable } from "mobx";
import { cloneDeep } from "lodash";
import {
    GameStateBase,
    GameStateInit,
    Gender,
    Player,
    PlayerWithSidePotStack,
    Sound,
    initialState,
} from "../types";

import {
    handleAI as handleAIUtil,
} from "../utils/ai";

export class RootStore {
    public loadedSounds: Sound[] = [];
    public userName = "";
    public playersNumber = "";
    public gender: Gender | undefined;
    public isSubmit = false;
    public winner: Player | undefined;
    public state: GameStateInit = initialState;

    public constructor() {
        // make class instance and needed fields observable
        makeAutoObservable(this, {}, { autoBind: true });
    }

    public setLoadedSounds: (sounds: Sound[]) => void = (sounds: Sound[]) => {
        this.loadedSounds = sounds;
    };

    public setUserName: (name: string) => void = (name: string) => {
        this.userName = name;
    };

    public setPlayersNumber: (number: string) => void = (number: string) => {
        this.playersNumber = number;
    };

    public setGender: (gender: Gender | undefined) => void = (checkedGender: Gender | undefined) => {
        this.gender = checkedGender;
    };

    public setIsSubmit: (value: boolean) => void = (value: boolean) => {
        this.isSubmit = value;
    };

    public setState: (newState: GameStateInit) => void = (newState: GameStateInit) => {
        this.state = { ...this.state, ...newState };
    };

    public pushAnimationState: (index: number, content: string) => void =
        (index: number, content: string) => {
            const { playerAnimationSwitchboard } = this.state;
            const newAnimationSwitchboard = { ...playerAnimationSwitchboard, ...{ [index]: { isAnimating: true, content } } };
            this.setState({ ...this.state, playerAnimationSwitchboard: newAnimationSwitchboard });
        };

    public handleAI: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = this.state;
        const newState =
            handleAIUtil(
                cloneDeep(appState as GameStateBase<Player>),
                this.pushAnimationState,
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

    public setWinner: (player: Player | undefined) => void = (player: Player | undefined) => {
        this.winner = player;
    };
}

export const RootStoreContext = React.createContext<RootStore | null>(null);
export const rootStore = new RootStore();
