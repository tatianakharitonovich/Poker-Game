import React from "react";
import { makeAutoObservable } from "mobx";
import { GameStateInit, Gender, Sound, playerAnimationSwitchboardInit } from "../types";

export class RootStore {
    public loadedSounds: Sound[] = [];
    public userName = "";
    public playersNumber = "";
    public gender: Gender | undefined;
    public isSubmit = false;
    public state: GameStateInit = {
        loading: true,
        winnerFound: null,
        players: null,
        numberPlayersActive: null,
        numberPlayersFolded: null,
        numberPlayersAllIn: null,
        activePlayerIndex: null,
        dealerIndex: null,
        blindIndex: null,
        deck: null,
        communityCards: [],
        pot: null,
        highBet: null,
        betInputValue: null,
        sidePots: [],
        minBet: 20,
        clearCards: false,
        phase: "loading",
        playerHierarchy: [],
        showDownMessages: [],
        playerAnimationSwitchboard: playerAnimationSwitchboardInit,
    };

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
}

export const RootStoreContext = React.createContext<RootStore | null>(null);
export const rootStore = new RootStore();
