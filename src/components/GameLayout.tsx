/* eslint-disable react/no-unused-state */
import React from "react";
import { observer } from "mobx-react";
import { cloneDeep } from "lodash";
import { LoadingOverlay } from "./loading-overlay/LoadingOverlay";
import { Game } from "./game/Game";
import { WinScreen } from "./WinScreen";

import {
    generateCardsDeck,
    shuffle,
    dealPrivateCards,
} from "../utils/cards";

import {
    createPlayers,
    beginNextRound,
    checkWin,
} from "../utils/players";

import {
    determineBlindIndices,
    anteUpBlinds,
    handleBet,
    handleFold as handleFoldUtils,
} from "../utils/bet";

import {
    handleAI as handleAIUtil,
} from "../utils/ai";

import {
    renderActionButtonText,
} from "../utils/ui";
import {
    GameState,
    GameStateBase,
    Player,
    PlayerWithSidePotStack,
} from "../types";
import { rootStore } from "../stores/rootStore";

@observer
export class GameLayout extends React.Component {
    public async componentDidMount() {
        const players = await createPlayers(rootStore.userName, rootStore.gender, rootStore.playersNumber);
        const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
        const blindIndicies = determineBlindIndices(dealerIndex, players.length);
        const { minBet } = rootStore.state;
        const playersBoughtIn = anteUpBlinds(players, blindIndicies, minBet);
        rootStore.setState({
            ...rootStore.state,
            players: playersBoughtIn,
            loading: false,
            numberPlayersActive: players.length,
            numberPlayersFolded: 0,
            numberPlayersAllIn: 0,
            activePlayerIndex: dealerIndex,
            dealerIndex,
            blindIndex: {
                big: blindIndicies.bigBlindIndex,
                small: blindIndicies.smallBlindIndex,
            },
            deck: shuffle(generateCardsDeck()),
            pot: 0,
            highBet: rootStore.state.minBet,
            betInputValue: rootStore.state.minBet,
            phase: "initialDeal",
        });
        this.runGameLoop();
    }

    public handleBetInputChange: (val: readonly number[], max: number) => void =
        (val: readonly number[], max: number) => {
            let value = val[0];
            if (val[0] > max) { value = max; }
            rootStore.setState({
                ...rootStore.state,
                betInputValue: parseInt(value.toString(), 10),
            });
        };

    public pushAnimationState: (index: number, content: string) => void =
        (index: number, content: string) => {
            const { playerAnimationSwitchboard } = rootStore.state;
            const newAnimationSwitchboard = { ...playerAnimationSwitchboard, ...{ [index]: { isAnimating: true, content } } };
            rootStore.setState({ ...rootStore.state, playerAnimationSwitchboard: newAnimationSwitchboard });
        };

    public popAnimationState: (index: number) => void = (index: number) => {
        const { playerAnimationSwitchboard } = rootStore.state;
        const persistContent = playerAnimationSwitchboard[index].content;
        const newAnimationSwitchboard = { ...playerAnimationSwitchboard, ...{ [index]: { isAnimating: false, content: persistContent } } };
        rootStore.setState({ ...rootStore.state, playerAnimationSwitchboard: newAnimationSwitchboard });
    };

    public handleBetInputSubmit: (bet: string, min: string, max: string) => void =
        (bet: string, min: string, max: string) => {
            const { playerAnimationSwitchboard, ...appState } = rootStore.state;
            const { activePlayerIndex, highBet, betInputValue, players } = appState as GameStateBase<Player>;
            this.pushAnimationState(
                activePlayerIndex,
                `${renderActionButtonText(
                    highBet,
                    betInputValue,
                    players[activePlayerIndex],
                )} ${(+bet > players[activePlayerIndex].bet) ? (bet) : ""}`);
            const newState = handleBet(
                cloneDeep(appState as GameStateBase<Player>),
                parseInt(bet, 10),
                parseInt(min, 10),
                parseInt(max, 10),
            ) as GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack>;
            rootStore.setState({ ...rootStore.state, ...newState });
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => {
                    this.handleAI();
                }, 2000);
            }
        };

    public handleFold: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = rootStore.state;
        const newState = handleFoldUtils(cloneDeep(appState as GameStateBase<Player>));
        rootStore.setState({ ...rootStore.state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                this.handleAI();
            }, 2000);
        }
    };

    public handleAI: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = rootStore.state;
        const newState =
            handleAIUtil(
                cloneDeep(appState as GameStateBase<Player>),
                this.pushAnimationState,
            ) as GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack>;
        rootStore.setState({
            ...rootStore.state,
            ...newState,
            betInputValue: newState.minBet,
        });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                this.handleAI();
            }, 2000);
        }
    };

    public runGameLoop: () => void = () => {
        const newState = dealPrivateCards(cloneDeep(rootStore.state as GameState)) as GameState;
        rootStore.setState({ ...rootStore.state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                this.handleAI();
            }, 2000);
        }
    };

    public handleNextRound: () => void = () => {
        rootStore.setState({ ...rootStore.state, clearCards: true });
        const newState = beginNextRound(cloneDeep(rootStore.state as GameState)) as GameState;
        if (checkWin(newState.players)) {
            rootStore.setState({ ...rootStore.state, winnerFound: true });
            return;
        }
        rootStore.setState({ ...rootStore.state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => this.handleAI(), 2000);
        }
    };

    public render() {
        const {
            loading,
            winnerFound,
            players,
            activePlayerIndex,
            pot,
            dealerIndex,
            betInputValue,
        } = rootStore.state;

        return (
            <>
                {(loading) ? <LoadingOverlay /> :
                    (winnerFound) ?
                        <WinScreen winners={players?.filter((player: { chips: number; }) => player.chips > 0)} /> :
                        (players !== null && activePlayerIndex !== null && rootStore.state.highBet !== null &&
                        pot !== null && dealerIndex !== null && betInputValue !== null) ? (
                            <Game
                                data-test="game"
                                handleNextRound={this.handleNextRound}
                                popAnimationState={this.popAnimationState}
                                handleBetInputChange={this.handleBetInputChange}
                                handleFold={this.handleFold}
                                handleBetInputSubmit={this.handleBetInputSubmit}
                            />
                            ) : null
                }
            </>
        );
    }
}
