/* eslint-disable import/no-cycle */
import { makeAutoObservable } from "mobx";
import { Gender, Player, Sound } from "../types";
import { determineMinBet } from "../utils/bet";
import { RootStore } from "./rootStore";

export class GameInfoStore {
    public loadedSounds: Sound[] = [];
    public userName = "";
    public playersNumber = "";
    public gender: Gender | undefined;
    public isSubmit = false;
    public winner: Player | undefined;

    public constructor(private rootStore: RootStore) {
        // make class instance and needed fields observable
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
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

    public get minBet(): number {
        return determineMinBet(
            this.rootStore.state.highBet as number,
            (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].chips,
            (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].bet,
        );
    }

    public get maxBet(): number {
        return (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].chips +
            (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].bet;
    }

    public setWinner: (player: Player | undefined) => void = (player: Player | undefined) => {
        this.winner = player;
    };
}
