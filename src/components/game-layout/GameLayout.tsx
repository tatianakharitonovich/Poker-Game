import React from "react";
import {
    generateCardsDeck,
    shuffle,
} from "../../utils/cards";

import { createPlayers } from "../../utils/players";

import {
    determineBlindIndices,
    anteUpBlinds,
} from "../../utils/bet";

import { SplashScreen } from "../splashscreen/SplashScreen";
import { GameContainer } from "../game/GameContainer";
import { WinScreenContainer } from "../win-screen/WinScreenContainer";
import { GameStateInit, Gender, Player } from "../../types";

interface GameLayoutProps {
    state: GameStateInit;
    userName: string;
    gender: Gender | undefined;
    playersNumber: string;
    setState: (newState: GameStateInit) => void;
    runGameLoop: () => void;
    winner: Player | undefined;
}

export class GameLayout extends React.Component<GameLayoutProps> {
    public async componentDidMount() {
        const { userName, gender, playersNumber, state, setState, runGameLoop } = this.props;
        const players = await createPlayers(userName, gender, playersNumber);
        const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
        const blindIndicies = determineBlindIndices(dealerIndex, players.length);
        const { minBet } = state;
        const playersBoughtIn = anteUpBlinds(players, blindIndicies, minBet);
        setTimeout(() => {
            setState({
                ...state,
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
                highBet: minBet,
                betInputValue: minBet,
                phase: "initialDeal",
            });
            setTimeout(() => {
                runGameLoop();
            }, 3000);
        }, 3000);
    }

    public render() {
        const { winner, state } = this.props;
        const {
            loading,
            players,
            activePlayerIndex,
            pot,
            dealerIndex,
            betInputValue,
            highBet,
        } = state;

        return (
            <>
                {(loading) ? <SplashScreen /> :
                    (winner) ?
                        <WinScreenContainer winner={winner} /> :
                        (players !== null && activePlayerIndex !== null && highBet !== null &&
                        pot !== null && dealerIndex !== null && betInputValue !== null) ? (
                            <GameContainer />
                            ) : null
                }
            </>
        );
    }
}
