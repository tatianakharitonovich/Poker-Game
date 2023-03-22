/* eslint-disable react/no-unused-state */
import React from "react";
import { cloneDeep } from "lodash";
import { flushSync } from "react-dom";
import { LoadingOverlay } from "./loading-overlay/LoadingOverlay";
import { Game } from "./game/Game";
import { WinScreen } from "./WinScreen";

import {
    generateCardsDeck,
    shuffle,
    dealPrivateCards,
} from "../utils/cards";

import {
    generateTable,
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
import { GameState, GameStateBase, GameStateInit, Gender, Player, PlayerWithSidePotStack } from "../types";

type GameLayoutProps = {
    userName: string;
    gender: Gender | undefined;
};

export class GameLayout extends React.Component<GameLayoutProps, GameStateInit> {
    private constructor(props: GameLayoutProps) {
        super(props);
        this.state = {
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
            playerAnimationSwitchboard: {
                0: { isAnimating: false, content: null },
                1: { isAnimating: false, content: null },
                2: { isAnimating: false, content: null },
                3: { isAnimating: false, content: null },
                4: { isAnimating: false, content: null },
                5: { isAnimating: false, content: null },
            },
        };
    }

    public async componentDidMount() {
        const { userName, gender } = this.props;
        const players = await generateTable(userName, gender);
        const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
        const blindIndicies = determineBlindIndices(dealerIndex, players.length);
        const { minBet } = this.state;
        const playersBoughtIn = anteUpBlinds(players, blindIndicies, minBet);
        const imageLoaderRequest = new XMLHttpRequest();

        imageLoaderRequest.addEventListener("load", () => {
            this.setState({
                loading: false,
            });
        });

        imageLoaderRequest.open("GET", "./assets/table.svg");
        imageLoaderRequest.send();
        flushSync(() => {
            this.setState((prevState: GameStateInit) => ({
                players: playersBoughtIn,
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
                highBet: prevState.minBet,
                betInputValue: prevState.minBet,
                phase: "initialDeal",
            }));
        });
        this.runGameLoop();
    }

    public handleBetInputChange: (val: readonly number[], max: number) => void =
        (val: readonly number[], max: number) => {
            let value = val[0];
            if (val[0] > max) { value = max; }
            this.setState({
                betInputValue: parseInt(value.toString(), 10),
            });
        };

    public pushAnimationState: (index: number, content: string) => void =
        (index: number, content: string) => {
            const { playerAnimationSwitchboard } = this.state;
            const newAnimationSwitchboard = { ...playerAnimationSwitchboard, ...{ [index]: { isAnimating: true, content } } };
            this.setState({ playerAnimationSwitchboard: newAnimationSwitchboard });
        };

    public popAnimationState: (index: number) => void = (index: number) => {
        const { playerAnimationSwitchboard } = this.state;
        const persistContent = playerAnimationSwitchboard[index].content;
        const newAnimationSwitchboard = { ...playerAnimationSwitchboard, ...{ [index]: { isAnimating: false, content: persistContent } } };
        this.setState({ playerAnimationSwitchboard: newAnimationSwitchboard });
    };

    public handleBetInputSubmit: (bet: string, min: string, max: string) => void =
        (bet: string, min: string, max: string) => {
            const { playerAnimationSwitchboard, ...appState } = this.state;
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
            this.setState(newState, () => {
                if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                    setTimeout(() => {
                        this.handleAI();
                    }, 1200);
                }
            });
        };

    public handleFold: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = this.state;
        const newState = handleFoldUtils(cloneDeep(appState as GameStateBase<Player>));
        this.setState(newState, () => {
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => {
                    this.handleAI();
                }, 1200);
            }
        });
    };

    public handleAI: () => void = () => {
        const { playerAnimationSwitchboard, ...appState } = this.state;
        const newState =
            handleAIUtil(
                cloneDeep(appState as GameStateBase<Player>),
                this.pushAnimationState,
            ) as GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack>;
        this.setState({
            ...newState,
            betInputValue: newState.minBet,
        }, () => {
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => {
                    this.handleAI();
                }, 1200);
            }
        });
    };

    public runGameLoop: () => void = () => {
        const newState = dealPrivateCards(cloneDeep(this.state as GameState)) as GameState;
        this.setState(newState, () => {
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => {
                    this.handleAI();
                }, 1200);
            }
        });
    };

    public handleNextRound: () => void = () => {
        this.setState({ clearCards: true });
        const newState = beginNextRound(cloneDeep(this.state as GameState)) as GameState;
        if (checkWin(newState.players)) {
            this.setState({ winnerFound: true });
            return;
        }
        this.setState(newState, () => {
            if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
                setTimeout(() => this.handleAI(), 1200);
            }
        });
    };

    public render() {
        const {
            loading,
            winnerFound,
            players,
            activePlayerIndex,
            highBet,
            pot,
            dealerIndex,
            betInputValue,
            phase,
            playerHierarchy,
            clearCards,
            showDownMessages,
            communityCards,
            playerAnimationSwitchboard,
        } = this.state;
        return (
            <div className="App">
                <div className="App-wrap">
                    {(loading) ? <LoadingOverlay /> :
                        (winnerFound) ?
                            <WinScreen winners={players?.filter((player: { chips: number; }) => player.chips > 0)} /> :
                            (players !== null && activePlayerIndex !== null && highBet !== null &&
                            pot !== null && dealerIndex !== null && betInputValue !== null) ? (
                                <Game
                                    highBet={highBet}
                                    players={players}
                                    activePlayerIndex={activePlayerIndex}
                                    phase={phase}
                                    pot={pot}
                                    loading={loading}
                                    dealerIndex={dealerIndex}
                                    playerHierarchy={playerHierarchy}
                                    clearCards={clearCards}
                                    handleNextRound={this.handleNextRound}
                                    popAnimationState={this.popAnimationState}
                                    handleBetInputChange={this.handleBetInputChange}
                                    betInputValue={betInputValue}
                                    showDownMessages={showDownMessages}
                                    communityCards={communityCards}
                                    handleFold={this.handleFold}
                                    handleBetInputSubmit={this.handleBetInputSubmit}
                                    playerAnimationSwitchboard={playerAnimationSwitchboard}
                                />
                                ) : null
                    }
                </div>
            </div>
        );
    }
}
