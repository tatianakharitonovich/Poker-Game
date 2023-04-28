/* eslint-disable import/no-cycle */
import { makeAutoObservable } from "mobx";
import { cloneDeep } from "lodash";
import { RootStore } from "./rootStore";
import { GameStateBase, Player, PlayerWithSidePotStack } from "../types";
import { renderActionButtonText } from "../utils/ui";
import { handleBet, handleFold as handleFoldUtils } from "../utils/bet";

export class BetProcessor {
    public constructor(private rootStore: RootStore) {
        // make class instance and needed fields observable
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    public handleBetInputSubmit: (bet: string, minBet: string, maxBet: string) => void =
        (bet: string, minBet: string, maxBet: string) => {
            const { playerAnimationSwitchboard, ...appState } = this.rootStore.state;
            this.rootStore.uiStore.pushAnimationState(
                this.rootStore.state.activePlayerIndex as number,
                `${renderActionButtonText(
                    this.rootStore.state.highBet as number,
                    this.rootStore.state.betInputValue as number,
                    (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number],
                )} ${(+bet > (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].bet)
                    ? (bet) : ""}`);
            const newState = handleBet(
                cloneDeep(appState as GameStateBase<Player>),
                parseInt(bet, 10),
                parseInt(minBet, 10),
                parseInt(maxBet, 10),
            ) as GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack>;
            this.rootStore.setState({ ...this.rootStore.state, ...newState });
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => {
                    this.rootStore.handleAI();
                }, 2000);
            }
        };

    public handleFold: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = this.rootStore.state;
        const newState = handleFoldUtils(cloneDeep(appState as GameStateBase<Player>));
        this.rootStore.setState({ ...this.rootStore.state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                this.rootStore.handleAI();
            }, 2000);
        }
    };

    public handleBetInputChange: (val: readonly number[], maxBet: number) => void =
        (val: readonly number[], maxBet: number) => {
            let value = val[0];
            if (val[0] > maxBet) { value = maxBet; }
            this.rootStore.setState({
                ...this.rootStore.state,
                betInputValue: parseInt(value.toString(), 10),
            });
        };
}
