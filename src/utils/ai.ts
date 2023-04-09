import {
    BetHierarchy,
    CardType,
    GameStateBase,
    Histogram,
    Player,
    PlayerWithSidePotStack,
    PokerHand,
} from "../types";
import { determineBestHand } from "./bestHand";

// eslint-disable-next-line import/no-cycle
import {
    handleBet,
    handleFold,
    determineMinBet,
} from "./bet";

import {
    renderActionButtonText,
} from "./ui";

const BET_HIERARCHY: BetHierarchy = {
    blind: 0,
    insignificant: 1,
    lowdraw: 2,
    meddraw: 3,
    hidraw: 4,
    strong: 5,
    major: 6,
    aggro: 7,
    beware: 8,
};

export const handleAI: (
    state: GameStateBase<Player>,
    pushAnimationState: (index: number, content: string) => void
) => void | GameStateBase<Player> | GameStateBase<PlayerWithSidePotStack> =
(state: GameStateBase<Player>, pushAnimationState: (index: number, content: string) => void) => {
    const { highBet } = state;
    const activePlayer = state.players[state.activePlayerIndex];
    const min = determineMinBet(highBet, activePlayer.chips, activePlayer.bet);
    const max = activePlayer.chips + activePlayer.bet;
    const totalInvestment = activePlayer.chips + activePlayer.bet + activePlayer.stackInvestment; // NOTE: StackInvestment must be incremented at each level of BETTING
    const investmentRequiredToRemain = (highBet / totalInvestment) * 100;
    const descendingSortHand = activePlayer.cards.concat(state.communityCards).sort((a, b) => b.value - a.value);
    const { suitHistogram } = generateHistogram(descendingSortHand);
    const stakes = classifyStakes(investmentRequiredToRemain);
    const preFlopValues = activePlayer.cards.map(el => el.value);
    const highCard = Math.max(...preFlopValues);
    const lowCard = Math.min(...preFlopValues);
    switch (state.phase) {
        // @ts-expect-error FALLS THROUGH to 2
        case ("betting1"): {
            const suited = Object.entries(suitHistogram).find(keyValuePair => keyValuePair[1] === 2); // checking for the presence of 2 identical suits
            const straightGap = (highCard - lowCard <= 4);
            const { callLimit, raiseChance, raiseRange } = buildPreFlopDeterminant(highCard, lowCard, suited, straightGap);
            const willCall = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[callLimit]);
            const callValue = (activePlayer.chips + activePlayer.bet >= highBet) ? highBet : activePlayer.chips + activePlayer.bet;
            if (willCall) {
                if (willRaise(raiseChance)) {
                    const determinedRaiseRange =
                        (raiseRange as (keyof BetHierarchy)[])[Math.floor(Math.random() * ((raiseRange as string[]).length - 0)) + 0];
                    const wantRaise = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[determinedRaiseRange]);
                    if (wantRaise) {
                        let betValue = roundToNearest((decideBetProportion(determinedRaiseRange) as number) * activePlayer.chips, 5);
                        if (betValue < highBet) {
                            if (highBet < max) {
                                betValue = highBet;
                            }
                        }
                        if (betValue > max) {
                            activePlayer.canRaise = false;
                            pushAnimationState(
                                state.activePlayerIndex,
                                `${renderActionButtonText(highBet, betValue, activePlayer)} ${betValue}`,
                            );
                            return handleBet(state, betValue, min, max);
                        }
                    } else {
                        pushAnimationState(
                            state.activePlayerIndex,
                            `${renderActionButtonText(
                                highBet,
                                callValue,
                                activePlayer)} ${(callValue > activePlayer.bet) ? (callValue) : ""}`,
                        );
                        return handleBet(state, callValue, min, max);
                    }
                } else {
                    pushAnimationState(
                        state.activePlayerIndex,
                        `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? (callValue) : ""}`);
                    return handleBet(state, callValue, min, max);
                }
            } else {
                pushAnimationState(state.activePlayerIndex, `FOLD`);
                return handleFold(state);
            }
        }
        // FALLS THROUGH to 2
        case ("betting2"):
        case ("betting3"):
        case ("betting4"):
            const highRank = determineBestHand(descendingSortHand);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { callLimit, raiseChance, raiseRange } = buildGeneralizedDeterminant(highRank)!;
            const willCall = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[callLimit]);
            const callValue = (activePlayer.chips + activePlayer.bet >= highBet) ? highBet : activePlayer.chips + activePlayer.bet;
            if (willCall) {
                if (willRaise(raiseChance)) {
                    const determinedRaiseRange = raiseRange[Math.floor(Math.random() * (raiseRange.length - 0)) + 0];
                    const wantRaise = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[determinedRaiseRange]);
                    if (wantRaise) {
                        let betValue = roundToNearest((decideBetProportion(determinedRaiseRange) as number) * activePlayer.chips, 5);
                        if (betValue < highBet) {
                            betValue = highBet;
                        }
                        activePlayer.canRaise = false;
                        pushAnimationState(
                            state.activePlayerIndex,
                            `${renderActionButtonText(highBet, betValue, activePlayer)} ${betValue}`,
                        );
                        return handleBet(state, betValue, min, max);
                    }
                    pushAnimationState(
                        state.activePlayerIndex,
                        `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? (callValue) : ""}`,
                    );
                    return handleBet(state, callValue, min, max);
                }
                pushAnimationState(
                    state.activePlayerIndex,
                    `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? (callValue) : ""}`,
                );
                return handleBet(state, callValue, min, max);
            }
            pushAnimationState(state.activePlayerIndex, `FOLD`);
            return handleFold(state);
        default: throw Error("Handle AI Running during incorrect phase");
    }
};

const buildGeneralizedDeterminant: (highRank: PokerHand) => {
    callLimit: keyof BetHierarchy;
    raiseChance: number;
    raiseRange: (keyof BetHierarchy)[];
} | undefined = (highRank: PokerHand) => {
    if (highRank === PokerHand.RoyalFlush) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["beware"],
        };
    } if (highRank === PokerHand.StraightFlush) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["strong", "aggro", "beware"],
        };
    } if (highRank === PokerHand.FourOfAKind) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["strong", "aggro", "beware"],
        };
    } if (highRank === PokerHand.FullHouse) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["hidraw", "strong", "aggro", "beware"],
        };
    } if (highRank === PokerHand.Flush) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["strong", "aggro", "beware"],
        };
    } if (highRank === PokerHand.Straight) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["lowdraw", "meddraw", "hidraw", "strong"],
        };
    } if (highRank === PokerHand.ThreeOfAKind) {
        return {
            callLimit: "beware",
            raiseChance: 1,
            raiseRange: ["lowdraw", "meddraw", "hidraw", "strong"],
        };
    } if (highRank === PokerHand.TwoPair) {
        return {
            callLimit: "beware",
            raiseChance: 0.7,
            raiseRange: ["lowdraw", "meddraw", "hidraw", "strong"],
        };
    } if (highRank === PokerHand.Pair) {
        return {
            callLimit: "hidraw",
            raiseChance: 0.5,
            raiseRange: ["lowdraw", "meddraw", "hidraw", "strong"],
        };
    } if (highRank === PokerHand.HighCard) {
        return {
            callLimit: "meddraw",
            raiseChance: 0.2,
            raiseRange: ["lowdraw", "meddraw", "hidraw", "strong"],
        };
    }
};

const buildPreFlopDeterminant: (
    highCard: number,
    lowCard: number,
    suited: [string, number] | undefined,
    straightGap: boolean
) => {
    callLimit: keyof BetHierarchy;
    raiseChance: number;
    raiseRange?: (keyof BetHierarchy)[];
} = (highCard: number, lowCard: number, suited: [string, number] | undefined, straightGap: boolean) => {
    if (highCard === lowCard) {
        if (highCard > 8) {
            return {
                callLimit: "beware",
                raiseChance: 0.9,
                raiseRange: ["lowdraw", "meddraw", "hidraw", "strong"],
            };
        }
        if (highCard > 5) {
            return {
                callLimit: "aggro",
                raiseChance: 0.75,
                raiseRange: ["insignificant", "lowdraw", "meddraw"],
            };
        }
        return {
            callLimit: "aggro",
            raiseChance: 0.5,
            raiseRange: ["insignificant", "lowdraw", "meddraw"],
        };
    } if (highCard > 9 && lowCard > 9) {
        if (suited) {
            return {
                callLimit: "beware",
                raiseChance: 1,
                raiseRange: ["insignificant", "lowdraw", "meddraw", "hidraw"],
            };
        }
        return {
            callLimit: "beware",
            raiseChance: 0.75,
            raiseRange: ["insignificant", "lowdraw", "meddraw", "hidraw"],
        };
    } if (highCard > 8 && lowCard > 6) {
        if (suited) {
            return {
                callLimit: "beware",
                raiseChance: 0.65,
                raiseRange: ["insignificant", "lowdraw", "meddraw", "hidraw"],
            };
        }
        return {
            callLimit: "beware",
            raiseChance: 0.45,
            raiseRange: ["insignificant", "lowdraw", "meddraw", "hidraw"],
        };
    } if (highCard > 8 && lowCard < 6) {
        if (suited) {
            return {
                callLimit: "major",
                raiseChance: 0.45,
                raiseRange: ["insignificant", "lowdraw"],
            };
        }
        return {
            callLimit: "aggro",
            raiseChance: 0.35,
            raiseRange: ["insignificant", "lowdraw"],
        };
    } if (highCard > 5 && lowCard > 3) {
        if (suited) {
            return {
                callLimit: "strong",
                raiseChance: 0.1,
                raiseRange: ["insignificant", "lowdraw"],
            };
        }
        if (straightGap) {
            return {
                callLimit: "aggro",
                raiseChance: 0,
            };
        }
        return {
            callLimit: "strong",
            raiseChance: 0,
        };
    } if (suited) {
        return {
            callLimit: "strong",
            raiseChance: 0.1,
            raiseRange: ["insignificant"],
        };
    } if (straightGap) {
        return {
            callLimit: "strong",
            raiseChance: 0,
        };
    }
    return {
        callLimit: "insignificant",
        raiseChance: 0,
    };
};

const classifyStakes: (percentage: number) => keyof BetHierarchy =
(percentage: number) => {
    switch (true) {
        case (percentage > 75):
            return "beware";
        case (percentage > 40):
            return "aggro";
        case (percentage > 35):
            return "major";
        case (percentage > 25):
            return "strong";
        case (percentage > 15):
            return "hidraw";
        case (percentage > 10):
            return "meddraw";
        case (percentage > 3):
            return "lowdraw";
        case (percentage >= 1):
            return "insignificant";
        case (percentage < 1):
        default:
            return "blind";
    }
};

const decideBetProportion: (stakes: keyof BetHierarchy) => number | undefined =
(stakes: keyof BetHierarchy) => {
    if (stakes === "blind") {
        return Math.random() * (0.1 - 0) + 0;
    } if (stakes === "insignificant") {
        return Math.random() * (0.03 - 0.01) + 0.01;
    } if (stakes === "lowdraw") {
        return Math.random() * (0.10 - 0.03) + 0.03;
    } if (stakes === "meddraw") {
        return Math.random() * (0.15 - 0.10) + 0.10;
    } if (stakes === "hidraw") {
        return Math.random() * (0.25 - 0.15) + 0.15;
    } if (stakes === "strong") {
        return Math.random() * (0.35 - 0.25) + 0.25;
    } if (stakes === "major") {
        return Math.random() * (0.40 - 0.35) + 0.35;
    } if (stakes === "aggro") {
        return Math.random() * (0.75 - 0.40) + 0.40;
    } if (stakes === "beware") {
        return Math.random() * (1 - 0.75) + 0.75;
    }
};

const willRaise: (chance: number) => boolean =
(chance: number) => {
    return Math.random() < chance;
};

const generateHistogram: (hand: CardType[]) => Histogram =
(hand: CardType[]) => {
    const histogram = hand.reduce((acc, cur) => {
        acc.frequencyHistogram[cur.cardRank] = (acc.frequencyHistogram[cur.cardRank] || 0) + 1;
        acc.suitHistogram[cur.suit] = (acc.suitHistogram[cur.suit] || 0) + 1;
        return acc;
    }, { frequencyHistogram: {}, suitHistogram: {} } as Histogram);
    return histogram;
};

export function roundToNearest(num: number, nearest: number): number {
    return Math.round(num / nearest) * nearest;
}
