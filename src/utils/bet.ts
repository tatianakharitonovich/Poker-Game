/* eslint-disable import/no-cycle */
import { BlindIndicies, GameStateBase, Player, PlayerWithSidePotStack, SidePots } from "../types";
import { dealFlop, dealBetting, showDown } from "./cards";
import { determineNextActivePlayer } from "./players";

export const determineBlindIndices: (dealerIndex: number, numPlayers: number) => BlindIndicies =
(dealerIndex: number, numPlayers: number) => {
    return ({
        bigBlindIndex: (dealerIndex + 2) % numPlayers,
        smallBlindIndex: (dealerIndex + 1) % numPlayers,
    });
};

export const anteUpBlinds: (players: Player[], blindIndices: BlindIndicies, minBet: number) => Player[] =
(players, blindIndices, minBet) => {
    const { bigBlindIndex, smallBlindIndex } = blindIndices;
    players[bigBlindIndex].bet = minBet;
    players[bigBlindIndex].chips -= minBet;
    players[smallBlindIndex].bet = minBet / 2;
    players[smallBlindIndex].chips -= (minBet / 2);
    return players;
};

export const determineMinBet: (highBet: number, playerChipsStack: number, playerBet: number) => number =
(highBet: number, playerChipsStack: number, playerBet: number) => {
    const playerTotalChips = playerChipsStack + playerBet;
    if (playerTotalChips < highBet) {
        return playerTotalChips;
    }
    return highBet;
};

export const handleBet: (
    state: GameStateBase<Player>,
    bet: number,
    min: number,
    max: number,
) => void | GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack> =
(
    state: GameStateBase<Player>,
    bet: number,
    min: number,
    max: number,
) => {
    if (bet < min) {
        state.betInputValue = min;
        // eslint-disable-next-line no-console
        return console.log("Invalid Bet");
    }
    if (bet > max) {
        state.betInputValue = max;
        // eslint-disable-next-line no-console
        return console.log("Invalid Bet");
    }

    if (bet > state.highBet) {
        state.highBet = bet;
        state.minBet = state.highBet;
        for (const player of state.players) {
            if (!player.folded || !(player.chips === 0)) {
                player.betReconciled = false;
            }
        }
    }
    const activePlayer = state.players[state.activePlayerIndex];
    const subtractableChips = bet - activePlayer.bet;
    activePlayer.bet = bet;

    activePlayer.chips -= subtractableChips;
    if (activePlayer.chips === 0) {
        activePlayer.allIn = true;
        state.numberPlayersAllIn++;
    }
    activePlayer.betReconciled = true;
    return determineNextActivePlayer(state);
};

export const handleFold: (state: GameStateBase<Player>) => GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<Player>) => {
    const activePlayer = state.players[state.activePlayerIndex];
    activePlayer.folded = true;
    activePlayer.betReconciled = true;
    state.numberPlayersFolded++;
    state.numberPlayersActive--;

    const nextState = determineNextActivePlayer(state);
    return nextState;
};

export const handlePhaseShift: (
    state: GameStateBase<Player>,
) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<Player>) => {
    switch (state.phase) {
        case ("betting1"): {
            state.phase = "flop";
            return dealFlop(reconcilePot(state));
        }
        case ("betting2"): {
            state.phase = "turn";
            return dealBetting(reconcilePot(state), "betting3");
        }
        case ("betting3"): {
            state.phase = "river";
            return dealBetting(reconcilePot(state), "betting4");
        }
        case ("betting4"): {
            state.phase = "showdown";
            return showDown(reconcilePot(state));
        }
        default: throw Error("handlePhaseShift() called from non-betting phase");
    }
};

export const reconcilePot: (state: GameStateBase<Player>) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<Player>) => {
    for (const player of state.players) {
        state.pot += player.bet;

        player.sidePotStack = player.bet;
        player.betReconciled = false;
    }
    const newState =
        condenseSidePots(calculateSidePots(state as GameStateBase<PlayerWithSidePotStack>, state.players as PlayerWithSidePotStack[]));

    for (const player of newState.players) {
        player.currentRoundChipsInvested += player.bet;
        player.bet = 0;
    }

    newState.minBet = 0;
    newState.highBet = 0;
    newState.betInputValue = 0;
    return newState;
};

const calculateSidePots: (
    state: GameStateBase<PlayerWithSidePotStack>,
    playerStacks: PlayerWithSidePotStack[]
) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>, playerStacks: PlayerWithSidePotStack[]) => {
    const investedPlayers = playerStacks.filter(player => player.sidePotStack > 0);
    if (investedPlayers.length === 0) {
        return state;
    }
    if (investedPlayers.length === 1) {
        const playerToRefund = state.players[state.players.findIndex(player => player.name === investedPlayers[0].name)];
        playerToRefund.chips += investedPlayers[0].sidePotStack;
        state.pot -= investedPlayers[0].sidePotStack;
        return state;
    }
    const ascBetPlayers = investedPlayers.sort((a, b) => a.sidePotStack - b.sidePotStack);
    const smallStackValue = ascBetPlayers[0].sidePotStack;

    const builtSidePot = ascBetPlayers.reduce((acc, cur) => {
        if (!cur.folded) {
            acc.participants.push(cur.name);
        }
        acc.potValue += smallStackValue;
        cur.sidePotStack -= smallStackValue;
        return acc;
    }, {
        participants: [],
        potValue: 0,
    } as SidePots);
    state.sidePots.push(builtSidePot);
    return calculateSidePots(state, ascBetPlayers);
};

const condenseSidePots: (state: GameStateBase<PlayerWithSidePotStack>) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>) => {
    if (state.sidePots.length > 1) {
        for (let i = 0; i < state.sidePots.length; i++) {
            for (let n = i + 1; n < state.sidePots.length; n++) {
                if (arrayIdentical(state.sidePots[i].participants, state.sidePots[n].participants)) {
                    state.sidePots[i].potValue += state.sidePots[n].potValue;
                    state.sidePots = state.sidePots.filter((el, index) => index !== n);
                }
            }
        }
    }
    return state;
};

const arrayIdentical = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every(el => arr2.includes(el));
};
