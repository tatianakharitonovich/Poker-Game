/* eslint-disable import/no-cycle */
import { cloneDeep } from "lodash";
import {
    Suits,
    CardRanks,
    ValueMap,
    CardType,
    GameState,
    PopCards,
    GameStateBase,
    PlayerWithSidePotStack,
    Suit,
    LowStraightRes,
    StraightRes,
    Quad,
    FrequencyHistogramMetaData,
    HierarchyPlayer,
    RankMap,
    Comparator,
    ComparatorItem,
    SnapshotFrame,
    Phase,
    Player,
    PokerHand,
} from "../types";
import { handleOverflowIndex, determinePhaseStartActivePlayer } from "./players";
import { determineBestHand } from "./bestHand";

const totalNumCards = 52;
const suits: Suits = ["Heart", "Spade", "Club", "Diamond"];
const ranks: CardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const VALUE_MAP: ValueMap = {
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    J: 10,
    Q: 11,
    K: 12,
    A: 13,
};

const randomizePosition: (min: number, max: number) => number =
(min: number, max: number) => {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
};

export const generateCardsDeck: () => CardType[] = () => {
    const deck = [] as CardType[];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                cardRank: rank,
                suit: suit,
                value: VALUE_MAP[rank],
            });
        }
    }
    return deck;
};

export const shuffle: (deck: CardType[]) => CardType[] = (deck: CardType[]) => {
    const shuffledDeck = new Array<CardType>(totalNumCards);
    const filledSlots = [] as number[];
    for (let i = 0; i < totalNumCards; i++) {
        if (i === 51) {
            const lastSlot = shuffledDeck.findIndex((el) => typeof el === "undefined");
            shuffledDeck[lastSlot] = deck[i];
            filledSlots.push(lastSlot);
        } else {
            let shuffleToPosition = randomizePosition(0, totalNumCards - 1);
            while (filledSlots.includes(shuffleToPosition)) {
                shuffleToPosition = randomizePosition(0, totalNumCards - 1);
            }
            shuffledDeck[shuffleToPosition] = deck[i];
            filledSlots.push(shuffleToPosition);
        }
    }
    return shuffledDeck;
};

const popCards: (deck: CardType[], numToPop: number) => PopCards =
(deck: CardType[], numToPop: number) => {
    const mutableDeckCopy = [...deck];
    let chosenCards: CardType[];
    if (numToPop === 1) {
        chosenCards = [mutableDeckCopy.pop() as CardType];
    } else {
        chosenCards = [] as CardType[];
        for (let i = 0; i < numToPop; i++) {
            chosenCards.push(mutableDeckCopy.pop() as CardType);
        }
    }
    return { mutableDeckCopy, chosenCards };
};

export const dealPrivateCards: (state: GameState) => GameState | undefined =
(state: GameState) => {
    state.clearCards = false;
    let animationDelay = 0;
    while (state.players[state.activePlayerIndex].cards.length < 2) {
        const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
        chosenCards[0].animationDelay = animationDelay;
        animationDelay += 250;
        const newDeck = [...mutableDeckCopy];
        state.players[state.activePlayerIndex].cards.push(chosenCards[0]);
        state.deck = newDeck;
        state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length);
    }
    if (state.players[state.activePlayerIndex].cards.length === 2) {
        state.phase = "betting1";
        return state;
    }
};

export const dealFlop: (state: GameStateBase<PlayerWithSidePotStack>) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>) => {
    let animationDelay = 0;
    const { mutableDeckCopy, chosenCards } = popCards(state.deck, 3);
    for (const card of chosenCards) {
        card.animationDelay = animationDelay;
        animationDelay += 250;
        state.communityCards.push(card);
    }
    state.deck = mutableDeckCopy;
    const newState = determinePhaseStartActivePlayer(state);
    newState.phase = "betting2";
    return newState;
};

export const dealBetting: (
    state: GameStateBase<PlayerWithSidePotStack>,
    phase: Phase) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>, phase) => {
    const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
    chosenCards[0].animationDelay = 0;
    state.communityCards.push(chosenCards[0]);
    state.deck = mutableDeckCopy;
    const newState = determinePhaseStartActivePlayer(state);
    newState.phase = phase;
    return newState;
};

export const showDown: (state: GameStateBase<PlayerWithSidePotStack>) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>) => {
    for (const player of state.players) {
        const frequencyHistogram = {} as Record<keyof ValueMap, number>;
        const suitHistogram = {} as Record<Suit, number>;

        player.showDownHand.hand = player.cards.concat(state.communityCards);
        player.showDownHand.descendingSortHand = player.showDownHand.hand.map(el => el).sort((a, b) => b.value - a.value);

        player.showDownHand.descendingSortHand.forEach(card => {
            frequencyHistogram[card.cardRank] = frequencyHistogram[card.cardRank] + 1 || 1;
            suitHistogram[card.suit] = (suitHistogram[card.suit] + 1 || 1);
        });

        let flushedSuit: Suit | undefined;
        for (const suit in suitHistogram) {
            if (suitHistogram[suit as Suit] >= 5) {
                flushedSuit = suit as Suit;
            }
        }

        const flushCards = player.showDownHand.descendingSortHand.filter(card => card.suit === flushedSuit);

        const frequencyHistogramMetaData = analyzeHistogram(frequencyHistogram);

        player.showDownHand.bestHandRank = determineBestHand(player.showDownHand.descendingSortHand);
        player.showDownHand.bestHand =
            buildBestHand(
                player.showDownHand.descendingSortHand,
                player.showDownHand.bestHandRank,
                flushCards,
                frequencyHistogramMetaData,
            );
    }
    return distributeSidePots(state);
};

const buildBestHand: (
    hand: CardType[],
    bestRank: PokerHand,
    flushCards: CardType[],
    frequencyHistogramMetaData: FrequencyHistogramMetaData
) => CardType[] = (
    hand: CardType[],
    bestRank: PokerHand,
    flushCards: CardType[],
    frequencyHistogramMetaData: FrequencyHistogramMetaData,
) => {
    switch (bestRank) {
        case (PokerHand.RoyalFlush): {
            return flushCards.slice(0, 5);
        }
        case (PokerHand.StraightFlush): {
            const valueSet = buildValueSet(hand);
            const { isLowStraight, concurrentCardValues, concurrentCardValuesLow } = checkStraight(valueSet);
            if (isLowStraight && concurrentCardValues.length < 5) {
                concurrentCardValuesLow[0] = 13;
                return (concurrentCardValuesLow as number[]).reduce((acc, cur, index) => {
                    if (index < 5) {
                        acc.push(flushCards[flushCards.findIndex(match => match.value === cur)]);
                    }
                    return acc;
                }, [] as CardType[]).reverse();
            }
            return concurrentCardValues.reduce((acc, cur, index) => {
                if (index < 5) {
                    acc.push(flushCards[flushCards.findIndex(match => match.value === cur)]);
                }
                return acc;
            }, [] as CardType[]);
        }
        case (PokerHand.FourOfAKind): {
            const bestHand = [];
            let mutableHand = cloneDeep(hand);

            for (let i = 0; i < 4; i++) {
                const indexOfQuad = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.quads[0].face);
                bestHand.push(mutableHand[indexOfQuad]);
                mutableHand = mutableHand.filter((match, index) => index !== indexOfQuad);
            }

            return bestHand.concat(mutableHand.slice(0, 1));
        }
        case (PokerHand.FullHouse): {
            const bestHand = [];
            let mutableHand = cloneDeep(hand);
            if (frequencyHistogramMetaData.tripples.length > 1) {
                for (let i = 0; i < 3; i++) {
                    const indexOfTripple = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.tripples[0].face);
                    bestHand.push(mutableHand[indexOfTripple]);
                    mutableHand = mutableHand.filter((match, index) => index !== indexOfTripple);
                }
                for (let i = 0; i < 2; i++) {
                    const indexOfPair = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.tripples[1].face);
                    bestHand.push(mutableHand[indexOfPair]);
                    mutableHand = mutableHand.filter((match, index) => index !== indexOfPair);
                }
                return bestHand;
            }
            for (let i = 0; i < 3; i++) {
                const indexOfTripple = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.tripples[0].face);
                bestHand.push(mutableHand[indexOfTripple]);
                mutableHand = mutableHand.filter((match, index) => index !== indexOfTripple);
            }
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.pairs[0].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter((match, index) => index !== indexOfPair);
            }
            return bestHand;
        }
        case (PokerHand.Flush): {
            return flushCards.slice(0, 5);
        }
        case (PokerHand.Straight): {
            const valueSet = buildValueSet(hand);
            const { isLowStraight, concurrentCardValues, concurrentCardValuesLow } = checkStraight(valueSet);
            if (isLowStraight && concurrentCardValues.length < 5) {
                concurrentCardValuesLow[0] = 13;
                return (concurrentCardValuesLow as number[]).reduce((acc, cur, index) => {
                    if (index < 5) {
                        acc.push(hand[hand.findIndex(match => match.value === cur)]);
                    }
                    return acc;
                }, [] as CardType[]).reverse();
            }
            return concurrentCardValues.reduce((acc, cur, index) => {
                if (index < 5) {
                    acc.push(hand[hand.findIndex(match => match.value === cur)]);
                }
                return acc;
            }, [] as CardType[]);
        }
        case (PokerHand.ThreeOfAKind): {
            const bestHand = [];
            let mutableHand = cloneDeep(hand);

            for (let i = 0; i < 3; i++) {
                const indexOfTripple = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.tripples[0].face);
                bestHand.push(mutableHand[indexOfTripple]);
                mutableHand = mutableHand.filter((match, index) => index !== indexOfTripple);
            }

            return bestHand.concat(mutableHand.slice(0, 2));
        }
        case (PokerHand.TwoPair): {
            const bestHand = [];
            let mutableHand = cloneDeep(hand);
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.pairs[0].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter((match, index) => index !== indexOfPair);
            }
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex(match => match.cardRank === frequencyHistogramMetaData.pairs[1].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter((match, index) => index !== indexOfPair);
            }
            return bestHand.concat(mutableHand.slice(0, 1));
        }
        case (PokerHand.Pair): {
            const bestHand = [];
            let mutableHand = cloneDeep(hand);
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex(card => card.cardRank === frequencyHistogramMetaData.pairs[0].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter((card, index) => index !== indexOfPair);
            }
            return bestHand.concat(mutableHand.slice(0, 3));
        }
        case (PokerHand.HighCard): {
            return hand.slice(0, 5);
        }
        default: throw Error("Recieved unfamiliar rank argument in buildBestHand()");
    }
};

const distributeSidePots: (state: GameStateBase<PlayerWithSidePotStack>) => GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<PlayerWithSidePotStack>) => {
    state.playerHierarchy = buildAbsolutePlayerRankings(state);
    let newState = state;
    for (const sidePot of state.sidePots) {
        const rankMap = rankPlayerHands(state, sidePot.participants);
        newState = battleRoyale(state, rankMap, sidePot.potValue);
    }

    newState.players = newState.players.map(player => ({
        ...player,
        roundEndChips: player.chips,
    }));
    return newState;
};

const buildAbsolutePlayerRankings: (state: GameStateBase<PlayerWithSidePotStack>) => HierarchyPlayer[] | HierarchyPlayer[][] =
(state: GameStateBase<PlayerWithSidePotStack>) => {
    const activePlayers = state.players.filter(player => !player.folded);
    let hierarchy = [] as HierarchyPlayer[][];

    const rankMap = new Map<PokerHand, RankMap[]>([
        [PokerHand.RoyalFlush, []],
        [PokerHand.StraightFlush, []],
        [PokerHand.FourOfAKind, []],
        [PokerHand.FullHouse, []],
        [PokerHand.Flush, []],
        [PokerHand.Straight, []],
        [PokerHand.ThreeOfAKind, []],
        [PokerHand.TwoPair, []],
        [PokerHand.Pair, []],
        [PokerHand.HighCard, []],
    ]);

    activePlayers.forEach((player, playerIndex) => {
        const {
            name,
            showDownHand: { bestHandRank, bestHand },
        } = player;
        rankMap.get(bestHandRank as PokerHand)?.push({
            name,
            bestHand: bestHand as CardType[],
            playerIndex,
        });
    });

    for (const [handRank, playersWhoHoldThisRank] of rankMap) {
        if (playersWhoHoldThisRank.length > 0) {
            if (handRank === PokerHand.RoyalFlush) {
                const formattedPlayersWhoHoldThisRank = playersWhoHoldThisRank.map((player) => ({
                    name: player.name,
                    bestHand: player.bestHand,
                    handRank,
                }));
                hierarchy = hierarchy.concat(formattedPlayersWhoHoldThisRank);
                continue;
            }
            if (playersWhoHoldThisRank.length === 1) {
                const { name, bestHand } = playersWhoHoldThisRank[0];
                hierarchy = hierarchy.concat([{
                    name,
                    bestHand,
                    handRank,
                }]);
            } else if (playersWhoHoldThisRank.length > 1) {
                const sortedComparator = buildComparator(handRank, playersWhoHoldThisRank)
                    .map((snapshot) => {
                        return snapshot.sort((a, b) => b.card.value - a.card.value);
                    });
                const winnerHierarchy = determineContestedHierarchy(sortedComparator, handRank);
                hierarchy = hierarchy.concat(winnerHierarchy);
            }
        }
    }
    return hierarchy;
};

const determineContestedHierarchy: (sortedComparator: ComparatorItem[][], handRank: PokerHand) => HierarchyPlayer[] =
(sortedComparator: ComparatorItem[][], handRank: PokerHand) => {
    let winnerHierarchy = [] as HierarchyPlayer[];
    let loserHierarchy = [] as ComparatorItem[][][];
    const processComparator: (comparator: ComparatorItem[][], round?: number) => void =
    (comparator: ComparatorItem[][], round = 0) => {
        if (comparator[0].length === 1) {
            const { name, bestHand } = comparator[0][0];
            winnerHierarchy = winnerHierarchy.concat([{ name, bestHand, handRank }]);
            return;
        }
        const filterableComparator = sortedComparator.map(el => el);
        const frame = comparator[round];
        const { winningFrame, losingFrame } = processSnapshotFrame(frame);
        if (losingFrame.length > 0) {
            const lowerTierComparator = filterableComparator.map(frameItem => {
                return frameItem.filter(snapshot => {
                    return losingFrame.some(snapshotToMatchName => {
                        return snapshotToMatchName.name === snapshot.name;
                    });
                });
            });
            loserHierarchy = [lowerTierComparator].concat(loserHierarchy);
        }
        if (winningFrame.length === 1) {
            const { name, bestHand } = winningFrame[0];
            winnerHierarchy = winnerHierarchy.concat([{
                name,
                bestHand,
                handRank,
            }]);
        } else if (round === (sortedComparator.length - 1)) {
            const filteredWinnerSnapshots: HierarchyPlayer[] = winningFrame.map(snapshot => ({
                name: snapshot.name,
                bestHand: snapshot.bestHand,
                handRank,
            }));
            winnerHierarchy = winnerHierarchy.concat(filteredWinnerSnapshots);
        } else {
            const higherTierComparator = filterableComparator.map(frameItem => {
                return frameItem.filter(snapshot => {
                    return winningFrame.some(snapshotToMatchName => {
                        return snapshotToMatchName.name === snapshot.name;
                    });
                });
            });
            processComparator(higherTierComparator, (round + 1));
        }
    };

    const processLowTierComparators: (loserHierarchyFrame: ComparatorItem[][][]) => void =
    (loserHierarchyFrame: ComparatorItem[][][]) => {
        if (loserHierarchy.length > 0) {
            const loserComparatorToProcess = loserHierarchyFrame[0];
            loserHierarchy = loserHierarchyFrame.slice(1);
            processComparator(loserComparatorToProcess);
            processLowTierComparators(loserHierarchy);
        }
    };
    processComparator(sortedComparator);
    processLowTierComparators(loserHierarchy);
    return winnerHierarchy;
};

const processSnapshotFrame: (frame: ComparatorItem[]) => SnapshotFrame =
(frame: ComparatorItem[]) => {
    const highValue = frame[0].card.value;
    const winningFrame = frame.filter(snapshot => snapshot.card.value === highValue);
    const losingFrame = frame.filter(snapshot => snapshot.card.value < highValue);
    return { winningFrame, losingFrame };
};

const rankPlayerHands: (
    state: GameStateBase<PlayerWithSidePotStack>,
    participants: string[]
) => Map<PokerHand, RankMap[]> =
(state: GameStateBase<PlayerWithSidePotStack>, participants: string[]) => {
    const rankMap = new Map<PokerHand, RankMap[]>([
        [PokerHand.RoyalFlush, []],
        [PokerHand.StraightFlush, []],
        [PokerHand.FourOfAKind, []],
        [PokerHand.FullHouse, []],
        [PokerHand.Flush, []],
        [PokerHand.Straight, []],
        [PokerHand.ThreeOfAKind, []],
        [PokerHand.TwoPair, []],
        [PokerHand.Pair, []],
        [PokerHand.HighCard, []],
    ]);

    for (const contestant of participants) {
        const playerIndex = state.players.findIndex(player => player.name === contestant);
        const player = state.players[playerIndex];
        if (!player.folded) {
            rankMap.get(player.showDownHand.bestHandRank as PokerHand)?.push({
                name: player.name,
                playerIndex,
                bestHand: player.showDownHand.bestHand as CardType[],
            });
        }
    }
    return rankMap;
};

const battleRoyale: (
    state: GameStateBase<PlayerWithSidePotStack>,
    rankMap: Map<PokerHand, RankMap[]>,
    prize: number
) => GameStateBase<PlayerWithSidePotStack> = (
    state: GameStateBase<PlayerWithSidePotStack>,
    rankMap: Map<PokerHand, RankMap[]>,
    prize: number,
) => {
    let winnerFound = false;
    let newState: GameStateBase<PlayerWithSidePotStack> = state;
    rankMap.forEach((participants, rank) => {
        if (!winnerFound) {
            if (participants.length === 1) {
                winnerFound = true;
                newState = payWinners(state, participants as Omit<RankMap, "bestHand">[], prize, rank);
            } else if (participants.length > 1) {
                winnerFound = true;
                const winners = determineWinner(buildComparator(rank, participants));
                if (winners.length === 1) {
                    newState = payWinners(state, winners, prize, rank);
                } else {
                    newState = payWinners(state, winners, prize, rank);
                }
            }
        }
    });
    return newState;
};

const payWinners: (
    state: GameStateBase<PlayerWithSidePotStack>,
    winners: Omit<RankMap, "bestHand">[],
    prize: number,
    rank: PokerHand
) => GameStateBase<PlayerWithSidePotStack> = (
    state: GameStateBase<PlayerWithSidePotStack>,
    winners: Omit<RankMap, "bestHand">[],
    prize: number,
    rank: PokerHand,
) => {
    if (winners.length === 1) {
        state.showDownMessages = state.showDownMessages.concat([{
            users: [winners[0].name],
            prize,
            rank,
        }]);
        state.players[winners[0].playerIndex].chips += prize;
        state.pot -= prize;
    } else if (winners.length > 1) {
        const splitPot = Math.floor(prize / winners.length);
        state.showDownMessages = state.showDownMessages.concat([{
            users: winners.map(winner => winner.name),
            prize: splitPot,
            rank,
        }]);
        winners.forEach(winner => {
            state.players[winner.playerIndex].chips += splitPot;
            state.pot -= splitPot;
        });
    }
    return state;
};

const buildComparator: (rank: PokerHand, playerData: RankMap[]) => Comparator =
(rank: PokerHand, playerData: RankMap[]) => {
    let comparator = [] as Comparator;
    switch (rank) {
        case (PokerHand.RoyalFlush): {
            comparator = Array.from({ length: 1 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        case (PokerHand.FourOfAKind): {
            comparator = Array.from({ length: 2 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[1].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        case (PokerHand.FullHouse): {
            comparator = Array.from({ length: 2 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[1].push({
                    card: playerData[index].bestHand[3],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        case (PokerHand.Flush):
        case (PokerHand.HighCard): {
            comparator = Array.from({ length: 5 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                for (let i = 0; i < 5; i++) {
                    comparator[i].push({
                        card: playerData[index].bestHand[i],
                        name: playerData[index].name,
                        playerIndex: playerData[index].playerIndex,
                        bestHand: playerData[index].bestHand,
                    });
                }
            });
            break;
        }
        case (PokerHand.ThreeOfAKind): {
            comparator = Array.from({ length: 3 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[1].push({
                    card: playerData[index].bestHand[3],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[2].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        case (PokerHand.Straight):
        case (PokerHand.StraightFlush): {
            comparator = Array.from({ length: 1 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        case (PokerHand.TwoPair): {
            comparator = Array.from({ length: 3 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[1].push({
                    card: playerData[index].bestHand[2],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[2].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        case (PokerHand.Pair): {
            comparator = Array.from({ length: 4 }, () => Array.from({ length: 0 }));
            playerData.forEach((playerShowdownData, index) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[1].push({
                    card: playerData[index].bestHand[2],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[2].push({
                    card: playerData[index].bestHand[3],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
                comparator[3].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand,
                });
            });
            break;
        }
        default: throw Error("Recieved unfamiliar rank argument in buildComparator()");
    }
    return comparator;
};

const determineWinner: (comparator: Comparator) => Omit<RankMap, "bestHand">[] =
(comparator: Comparator) => {
    let winners = [] as Omit<RankMap, "bestHand">[];
    for (let i = 0; i < comparator.length; i++) {
        let highValue = 0;
        const losers = [] as string[];
        winners = comparator[i].sort((a, b) => b.card.value - a.card.value).reduce((acc, cur) => {
            if (cur.card.value > highValue) {
                highValue = cur.card.value;
                acc.push({
                    name: cur.name,
                    playerIndex: cur.playerIndex,
                });
                return acc;
            }
            if (cur.card.value === highValue) {
                acc.push({
                    name: cur.name,
                    playerIndex: cur.playerIndex,
                });
                return acc;
            }
            if (cur.card.value < highValue) {
                losers.push(cur.name);
                return acc;
            }
            return acc;
        }, [] as Omit<RankMap, "bestHand">[]);

        if (winners.length === 1 || i === comparator.length) {
            return winners;
        }
        if (losers.length >= 1) {
            losers.forEach((nameToExtract) => {
                // eslint-disable-next-line no-param-reassign
                comparator = comparator.map(snapshot => snapshot.filter((el) => el.name !== nameToExtract));
            });
        }
    }
    return winners;
};

export const analyzeHistogram: (frequencyHistogram: Record<keyof ValueMap, number>) => FrequencyHistogramMetaData =
(frequencyHistogram: Record<keyof ValueMap, number>) => {
    const frequencyHistogramMetaData = {
        pairs: [] as Quad[],
        tripples: [] as Quad[],
        quads: [] as Quad[],
    };
    // eslint-disable-next-line guard-for-in
    for (const cardRank in frequencyHistogram) {
        if (frequencyHistogram[cardRank as keyof ValueMap] === 4) {
            frequencyHistogramMetaData.quads.push({
                face: cardRank as keyof ValueMap,
                value: VALUE_MAP[cardRank as keyof ValueMap],
            });
        }
        if (frequencyHistogram[cardRank as keyof ValueMap] === 3) {
            frequencyHistogramMetaData.tripples.push({
                face: cardRank as keyof ValueMap,
                value: VALUE_MAP[cardRank as keyof ValueMap],
            });
        }
        if (frequencyHistogram[cardRank as keyof ValueMap] === 2) {
            frequencyHistogramMetaData.pairs.push({
                face: cardRank as keyof ValueMap,
                value: VALUE_MAP[cardRank as keyof ValueMap],
            });
        }
    }
    frequencyHistogramMetaData.pairs = frequencyHistogramMetaData.pairs.map(el => el).sort((a, b) => b.value - a.value);
    frequencyHistogramMetaData.tripples = frequencyHistogramMetaData.tripples.map(el => el).sort((a, b) => b.value - a.value);
    frequencyHistogramMetaData.quads = frequencyHistogramMetaData.quads.map(el => el).sort((a, b) => b.value - a.value);
    return frequencyHistogramMetaData;
};

export const checkStraight: (valueSet: (ValueMap[keyof ValueMap])[]) => StraightRes =
(valueSet: (ValueMap[keyof ValueMap])[]) => {
    if (valueSet.length < 5) {
        return {
            isStraight: false,
            isLowStraight: false,
            concurrentCardValues: [],
            concurrentCardValuesLow: [],
        };
    }
    let numConcurrentCards = 0;
    let concurrentCardValues = [];
    for (let i = 1; i < valueSet.length; i++) {
        if (numConcurrentCards === 5) {
            return {
                isStraight: true,
                isLowStraight: false,
                concurrentCardValues,
                concurrentCardValuesLow: [],
            };
        }
        if ((valueSet[i] - valueSet[i - 1]) === -1) {
            if (numConcurrentCards === 0) {
                numConcurrentCards = 2;
                concurrentCardValues.push(valueSet[i - 1]);
                concurrentCardValues.push(valueSet[i]);
            } else {
                numConcurrentCards++;
                concurrentCardValues.push(valueSet[i]);
            }
        } else {
            numConcurrentCards = 0;
            concurrentCardValues = [];
        }
    }
    if (numConcurrentCards >= 5) {
        return {
            isStraight: true,
            isLowStraight: false,
            concurrentCardValues,
            concurrentCardValuesLow: [],
        };
    }
    if (valueSet[0] === 13) {
        const { isLowStraight, concurrentCardValuesLow } = checkLowStraight(cloneDeep(valueSet));
        if (isLowStraight) {
            return {
                isStraight: true,
                isLowStraight,
                concurrentCardValues,
                concurrentCardValuesLow,
            };
        }
    }
    return {
        isStraight: false,
        isLowStraight: false,
        concurrentCardValues,
        concurrentCardValuesLow: [],
    };
};

const checkLowStraight: (valueSetCopy: (ValueMap[keyof ValueMap])[]) => LowStraightRes =
(valueSetCopy: (ValueMap[keyof ValueMap])[]) => {
    let numConcurrentCards = 0;
    let concurrentCardValuesLow = [];
    valueSetCopy.shift();
    const newValueSetCopy = [0].concat(valueSetCopy);
    const sortedValueSetCopy = newValueSetCopy.map(el => el).sort((a, b) => a - b);
    for (let i = 1; i < 5; i++) {
        if (numConcurrentCards >= 5) {
            return {
                isLowStraight: true,
                concurrentCardValuesLow,
            };
        }
        if ((sortedValueSetCopy[i] - sortedValueSetCopy[i - 1]) === 1) {
            if (numConcurrentCards === 0) {
                numConcurrentCards = 2;
                concurrentCardValuesLow.push(sortedValueSetCopy[i - 1]);
                concurrentCardValuesLow.push(sortedValueSetCopy[i]);
            } else {
                numConcurrentCards++;
                concurrentCardValuesLow.push(sortedValueSetCopy[i]);
            }
        } else {
            numConcurrentCards = 0;
            concurrentCardValuesLow = [];
        }
    }
    if (numConcurrentCards >= 5) {
        return {
            isLowStraight: true,
            concurrentCardValuesLow,
        };
    }
    return {
        isLowStraight: false,
        concurrentCardValuesLow,
    };
};

export const buildValueSet: (hand: CardType[]) => (ValueMap[keyof ValueMap])[] = (hand: CardType[]) => {
    return Array.from(new Set(hand.map(cardInfo => cardInfo.value)));
};

export const dealMissingCommunityCards: (state: GameStateBase<Player>) => GameStateBase<Player> =
(state: GameStateBase<Player>) => {
    const cardsToPop = 5 - state.communityCards.length;
    if (cardsToPop >= 1) {
        let animationDelay = 0;
        const { mutableDeckCopy, chosenCards } = popCards(state.deck, cardsToPop);
        for (const card of chosenCards) {
            card.animationDelay = animationDelay;
            animationDelay += 250;
            state.communityCards.push(card);
        }
        state.deck = mutableDeckCopy;
    }
    state.phase = "showdown";
    return state;
};
