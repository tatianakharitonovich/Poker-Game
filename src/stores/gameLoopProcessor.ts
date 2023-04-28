/* eslint-disable import/no-cycle */
import { makeAutoObservable } from "mobx";
import { cloneDeep } from "lodash";
import { RootStore } from "./rootStore";
import { GameState, initialState } from "../types";
import { dealPrivateCards } from "../utils/cards";
import { beginNextRound, checkWin } from "../utils/players";

export class GameLoopProcessor {
    public constructor(private rootStore: RootStore) {
        // make class instance and needed fields observable
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    public runGameLoop: () => void = () => {
        const newState = dealPrivateCards(cloneDeep(this.rootStore.state as GameState)) as GameState;
        this.rootStore.setState({ ...this.rootStore.state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                this.rootStore.handleAI();
            }, 2000);
        }
    };

    public handleNextRound: () => void = () => {
        this.rootStore.setState({ ...this.rootStore.state, clearCards: true });
        const newState = beginNextRound(cloneDeep(this.rootStore.state as GameState)) as GameState;
        if (checkWin(newState.players, this.rootStore.gameInfoStore.setWinner)) {
            this.rootStore.setState({ ...newState, winnerFound: true });
            return;
        }
        this.rootStore.setState({ ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => this.rootStore.handleAI(), 2000);
        }
    };

    public endTransition: (indexPlayer: number) => void = (indexPlayer: number) => {
        const { playerAnimationSwitchboard } = this.rootStore.state;
        const persistContent = playerAnimationSwitchboard[indexPlayer].content;
        const newAnimationSwitchboard = {
            ...playerAnimationSwitchboard,
            ...{ [indexPlayer]: { isAnimating: false, content: persistContent } },
        };
        this.rootStore.setState({ ...this.rootStore.state, playerAnimationSwitchboard: newAnimationSwitchboard });
    };

    public exitHandler: () => void = () => {
        this.rootStore.gameInfoStore.setIsSubmit(false);
        this.rootStore.gameInfoStore.setWinner(undefined);
        this.rootStore.setState(initialState);
    };
}
