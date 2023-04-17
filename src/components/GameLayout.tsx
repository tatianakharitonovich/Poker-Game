import React from "react";
import { observer } from "mobx-react";
import { cloneDeep } from "lodash";
import { LoadingOverlay } from "./loading-overlay/LoadingOverlay";
import { Game } from "./game/Game";
import { WinScreen } from "./win-screen/WinScreen";

import {
    generateCardsDeck,
    shuffle,
    dealPrivateCards,
} from "../utils/cards";

import { createPlayers } from "../utils/players";

import {
    determineBlindIndices,
    anteUpBlinds,
} from "../utils/bet";

import { GameState } from "../types";
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

    public runGameLoop: () => void = () => {
        const newState = dealPrivateCards(cloneDeep(rootStore.state as GameState)) as GameState;
        rootStore.setState({ ...rootStore.state, ...newState });
        if ((newState.players[newState.activePlayerIndex].isFake) && (newState.phase !== "showdown")) {
            setTimeout(() => {
                rootStore.handleAI();
            }, 2000);
        }
    };

    public render() {
        const {
            loading,
            players,
            activePlayerIndex,
            pot,
            dealerIndex,
            betInputValue,
        } = rootStore.state;

        return (
            <>
                {(loading) ? <LoadingOverlay /> :
                    (rootStore.winner) ?
                        <WinScreen winner={rootStore.winner} /> :
                        (players !== null && activePlayerIndex !== null && rootStore.state.highBet !== null &&
                        pot !== null && dealerIndex !== null && betInputValue !== null) ? (
                            <Game />
                            ) : null
                }
            </>
        );
    }
}
