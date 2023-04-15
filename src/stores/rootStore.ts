import React from "react";
import { makeAutoObservable } from "mobx";
import { Gender, Sound } from "../types";

export class RootStore {
    public loadedSounds: Sound[] = [];
    public userName = "";
    public playersNumber = "";
    public gender: Gender | undefined;
    public isSubmit = false;

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
}

export const RootStoreContext = React.createContext<RootStore | null>(null);
export const rootStore = new RootStore();
