/* eslint-disable import/no-cycle */
import { makeAutoObservable } from "mobx";
import { Player, PlayerBet } from "../types";
import { RootStore } from "./rootStore";
import { renderActionButtonText } from "../utils/ui";

export class UIStore {
    public constructor(private rootStore: RootStore) {
        // make class instance and needed fields observable
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    public get buttonText(): PlayerBet | undefined {
        return renderActionButtonText(
            this.rootStore.state.highBet as number,
            this.rootStore.state.betInputValue as number,
            (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number],
        );
    }

    public get isShowActionMenu(): boolean {
        return (this.rootStore.state.phase === "betting1" ||
            this.rootStore.state.phase === "betting2" ||
            this.rootStore.state.phase === "betting3" ||
            this.rootStore.state.phase === "betting4") &&
        (!(this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].isFake) &&
        (this.rootStore.state.players as Player[])[this.rootStore.state.activePlayerIndex as number].chips >=
        (this.rootStore.state.highBet as number);
    }

    public pushAnimationState: (index: number, content: string) => void =
        (index: number, content: string) => {
            const { playerAnimationSwitchboard } = this.rootStore.state;
            const newAnimationSwitchboard = { ...playerAnimationSwitchboard, ...{ [index]: { isAnimating: true, content } } };
            this.rootStore.setState({ ...this.rootStore.state, playerAnimationSwitchboard: newAnimationSwitchboard });
        };
}
