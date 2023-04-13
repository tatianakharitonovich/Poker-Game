/* eslint-disable import/no-cycle */
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { GameState, GameStateBase, Gender, Player, PlayerDataRes, PlayerWithSidePotStack } from "../types";
import { handlePhaseShift, reconcilePot, anteUpBlinds, determineBlindIndices } from "./bet";
import { dealMissingCommunityCards, showDown, generateCardsDeck, shuffle, dealPrivateCards } from "./cards";
import { roundToNearest } from "./ai";

export const createPlayers: (
    userName: string,
    gender: Gender | undefined,
    playersNumber: string
) => Promise<Player[]> =
async (userName, gender, playersNumber) => {
    const users = [{
        id: uuidv4(),
        name: userName,
        avatarURL: gender === "male" ? "/assets/images/boy.svg" : "/assets/images/girl.svg",
        cards: [],
        showDownHand: {
            hand: [],
            descendingSortHand: [],
        },
        chips: 20000,
        roundStartChips: 20000,
        roundEndChips: 20000,
        currentRoundChipsInvested: 0,
        bet: 0,
        betReconciled: false,
        folded: false,
        allIn: false,
        canRaise: true,
        stackInvestment: 0,
        isFake: false,
    }] as Player[];

    try {
        const response = await axios.get<PlayerDataRes>(`https://randomuser.me/api/?results=${+playersNumber - 1}`);
        response.data.results
            .map((user) => {
                const randomizedChips = roundToNearest(Math.random() * (20000 - 18000), 5) + 18000;
                return ({
                    id: uuidv4(),
                    name: `${user.name.first.charAt(0).toUpperCase()}${user.name.first.slice(1)}
                        ${user.name.last.charAt(0).toUpperCase()}${user.name.last.slice(1)}`,
                    avatarURL: user.picture.large,
                    cards: [],
                    chips: randomizedChips,
                    roundStartChips: randomizedChips,
                    roundEndChips: randomizedChips,
                    currentRoundChipsInvested: 0,
                    showDownHand: {
                        hand: [],
                        descendingSortHand: [],
                    },
                    bet: 0,
                    betReconciled: false,
                    folded: false,
                    allIn: false,
                    isFake: true,
                    canRaise: true,
                    stackInvestment: 0,
                } as Player);
            })
            .forEach((user: Player) => users.push(user));

        return users;
    } catch (e) {
        throw new Error(`${e}`);
    }
};
export const handleOverflowIndex: (currentIndex: number, incrementBy: number, arrayLength: number) => number =
(currentIndex, incrementBy, arrayLength) => {
    return (currentIndex + incrementBy) % arrayLength;
};

export const determinePhaseStartActivePlayer: (
    state: GameStateBase<PlayerWithSidePotStack>,
    recursion?: boolean) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>, recursion = false) => {
    if (!recursion) {
        state.activePlayerIndex = state.dealerIndex;
    } else if (recursion) {
        state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length);
    }
    if (state.players[state.activePlayerIndex].folded) {
        return determinePhaseStartActivePlayer(state, true);
    }
    if (state.players[state.activePlayerIndex].chips === 0) {
        return determinePhaseStartActivePlayer(state, true);
    }
    return state;
};

export const determineNextActivePlayer: (state: GameStateBase<Player>) => GameStateBase<PlayerWithSidePotStack> | GameStateBase<Player> =
(state: GameStateBase<Player>) => {
    state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length);
    const activePlayer = state.players[state.activePlayerIndex];

    const allButOnePlayersAreAllIn = (state.numberPlayersActive - state.numberPlayersAllIn === 1);
    if (state.numberPlayersActive === 1) {
        return (showDown(reconcilePot(dealMissingCommunityCards(state))));
    }
    if (activePlayer.folded) {
        return determineNextActivePlayer(state);
    }
    if (
        allButOnePlayersAreAllIn &&
        !activePlayer.folded &&
        activePlayer.betReconciled
    ) {
        return (showDown(reconcilePot(dealMissingCommunityCards(state))));
    }
    if (activePlayer.chips === 0) {
        if (state.numberPlayersAllIn === state.numberPlayersActive) {
            return (showDown(reconcilePot(dealMissingCommunityCards(state))));
        }
        if (allButOnePlayersAreAllIn && activePlayer.allIn) {
            return (showDown(reconcilePot(dealMissingCommunityCards(state))));
        }
        return determineNextActivePlayer(state);
    }
    if (activePlayer.betReconciled) {
        return handlePhaseShift(state);
    }
    return state;
};

const passDealerChip: (state: GameState) => GameState | undefined =
(state: GameState) => {
    state.dealerIndex = handleOverflowIndex(state.dealerIndex, 1, state.players.length);
    const nextDealer = state.players[state.dealerIndex];
    if (nextDealer.chips === 0) {
        return passDealerChip(state);
    }
    return filterBrokePlayers(state, nextDealer.name);
};

const filterBrokePlayers: (state: GameState, dealerID: string) => GameState | undefined =
(state: GameState, dealerID: string) => {
    state.players = state.players.filter(player => player.chips > 0);
    const newDealerIndex = state.players.findIndex(player => player.name === dealerID);
    state.dealerIndex = newDealerIndex;
    state.activePlayerIndex = newDealerIndex;
    if (state.players.length === 1) {
        return state;
    } if (state.players.length === 2) {
        state.blindIndex.small = newDealerIndex;
        state.blindIndex.big = handleOverflowIndex(newDealerIndex, 1, state.players.length);
        state.players = anteUpBlinds(
            state.players,
            { bigBlindIndex: state.blindIndex.big, smallBlindIndex: state.blindIndex.small },
            state.minBet,
        ).map(player => ({
            ...player,
            cards: [],
            showDownHand: {
                hand: [],
                descendingSortHand: [],
            },
            roundStartChips: player.chips + player.bet,
            currentRoundChipsInvested: 0,
            betReconciled: false,
            folded: false,
            allIn: false,
        }));
        state.numberPlayersAllIn = 0;
        state.numberPlayersFolded = 0;
        state.numberPlayersActive = state.players.length;
    } else {
        const blindIndicies = determineBlindIndices(newDealerIndex, state.players.length);
        state.blindIndex = {
            big: blindIndicies.bigBlindIndex,
            small: blindIndicies.smallBlindIndex,
        };
        state.players = anteUpBlinds(state.players, blindIndicies, state.minBet).map(player => ({
            ...player,
            cards: [],
            showDownHand: {
                hand: [],
                descendingSortHand: [],
            },
            roundStartChips: player.chips + player.bet,
            currentRoundChipsInvested: 0,
            betReconciled: false,
            folded: false,
            allIn: false,
        }));
        state.numberPlayersAllIn = 0;
        state.numberPlayersFolded = 0;
        state.numberPlayersActive = state.players.length;
    }
    return dealPrivateCards(state);
};

export const beginNextRound: (state: GameState) => GameState | undefined = (state: GameState) => {
    state.communityCards = [];
    state.sidePots = [];
    state.playerHierarchy = [];
    state.showDownMessages = [];
    state.deck = shuffle(generateCardsDeck());
    state.highBet = 20;
    state.betInputValue = 20;
    state.minBet = 20;
    const { players } = state;
    const clearPlayerCards = players.map(player => ({ ...player, cards: [] }));
    state.players = clearPlayerCards;
    return passDealerChip(state);
};

export const checkWin: (players: Player[]) => boolean =
(players: Player[]) => {
    return (players.filter(player => player.chips > 0).length === 1);
};
