export type Gender = "male" | "female";

export interface Sound {
    name: SoundName;
    src: string;
    audio: HTMLAudioElement;
}

export enum SoundName {
    main = "main",
    menu = "menu",
    card = "card",
    check = "check",
    positive = "positive",
    negative = "negative",
    rise = "rise",
    fold = "fold",
    allin = "allin",
    finish = "finish",
}

export type PlayerBet = "Check" | "Call" | "Bet" | "All-In!" | "Raise";

export enum PokerHand {
    HighCard = "High Card",
    Pair = "Pair",
    TwoPair = "Two Pair",
    ThreeOfAKind = "Three Of A Kind",
    Straight = "Straight",
    Flush = "Flush",
    FullHouse = "Full House",
    FourOfAKind = "Four Of A Kind",
    StraightFlush = "Straight Flush",
    RoyalFlush = "Royal Flush",
}

export type Suits = ["Heart", "Spade", "Club", "Diamond"];

export type Suit = "Heart" | "Spade" | "Club" | "Diamond";
export type CardRanks = (keyof ValueMap)[];
export type ValueMap = {
    "2": 1;
    "3": 2;
    "4": 3;
    "5": 4;
    "6": 5;
    "7": 6;
    "8": 7;
    "9": 8;
    "10": 9;
    "J": 10;
    "Q": 11;
    "K": 12;
    "A": 13;
};

export type BetHierarchy = {
    blind: 0;
    insignificant: 1;
    lowdraw: 2;
    meddraw: 3;
    hidraw: 4;
    strong: 5;
    major: 6;
    aggro: 7;
    beware: 8;
};

export type Phase =
    "loading" |
    "initialDeal" |
    "showdown" |
    "betting1" |
    "betting2" |
    "betting3" |
    "betting4" |
    "flop" |
    "turn" |
    "river" |
    "showdown";

export type CardType = {
    cardRank: keyof ValueMap;
    suit: Suit;
    value: ValueMap[keyof ValueMap];
    animationDelay?: number;
};

export const playerAnimationSwitchboardInit = {
    0: { isAnimating: false, content: null },
    1: { isAnimating: false, content: null },
    2: { isAnimating: false, content: null },
    3: { isAnimating: false, content: null },
    4: { isAnimating: false, content: null },
    5: { isAnimating: false, content: null },
};

export const initialState: GameStateInit = {
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
    playerAnimationSwitchboard: playerAnimationSwitchboardInit,
};

export type PlayerRank = {
    name: PokerHand;
    match: boolean | undefined;
};

export interface Player {
    id: string;
    name: string;
    avatarURL: string;
    cards: CardType[];
    showDownHand: {
        hand: CardType[];
        descendingSortHand: CardType[];
        heldRankHierarchy?: PlayerRank[];
        bestHandRank?: PokerHand;
        bestHand?: CardType[];
    };
    chips: number;
    roundStartChips: number;
    roundEndChips: number;
    currentRoundChipsInvested: number;
    bet: number;
    betReconciled: boolean;
    folded: boolean;
    allIn: boolean;
    canRaise: boolean;
    stackInvestment: number;
    isFake: boolean;
    sidePotStack?: number;
}

export interface PlayerWithSidePotStack extends Player {
    sidePotStack: number;
}

export interface PlayerData {
    name: {
        first: string;
        last: string;
    };
    picture: {
        large: string;
    };
}

export type PlayerDataRes = {
    results: PlayerData[];
};

export type PlayerAnimationSwitchboard = Record<number, {
    isAnimating: boolean;
    content: string | null;
}>;

export type ShowDownMessage = {
    users: string[];
    prize: number;
    rank: PokerHand;
};

export type BlindIndicies = {
    bigBlindIndex: number;
    smallBlindIndex: number;
};

export type BlindIndex = {
    big: number;
    small: number;
};

export type SidePots = {
    participants: string[];
    potValue: number;
};

export type HierarchyPlayer = {
    name: string;
    bestHand: CardType[];
    handRank: PokerHand;
};

export type SnapshotFrame = {
    winningFrame: ComparatorItem[];
    losingFrame: ComparatorItem[];
};

export type RankMap = {
    name: string;
    bestHand: CardType[];
    playerIndex: number;
};

export type ComparatorItem = {
    card: CardType;
    name: string;
    playerIndex: number;
    bestHand: CardType[];
};

export type Comparator = ComparatorItem[][];

export interface GameStateInit {
    loading: boolean;
    winnerFound: boolean | null;
    players: Player[] | null;
    numberPlayersActive: number | null;
    numberPlayersFolded: number | null;
    numberPlayersAllIn: number | null;
    activePlayerIndex: number | null;
    dealerIndex: number | null;
    blindIndex: BlindIndex | null;
    deck: CardType[] | null;
    communityCards: CardType[];
    pot: number | null;
    highBet: number | null;
    betInputValue: number | null;
    sidePots: SidePots[];
    minBet: number;
    clearCards: boolean;
    phase: Phase;
    playerHierarchy: HierarchyPlayer[] | HierarchyPlayer[][];
    showDownMessages: ShowDownMessage[];
    playerAnimationSwitchboard: PlayerAnimationSwitchboard;
}

export interface GameState {
    loading: boolean;
    winnerFound: boolean | null;
    players: Player[];
    numberPlayersActive: number;
    numberPlayersFolded: number;
    numberPlayersAllIn: number;
    activePlayerIndex: number;
    dealerIndex: number;
    blindIndex: BlindIndex;
    deck: CardType[];
    communityCards: CardType[];
    pot: number;
    highBet: number;
    betInputValue: number;
    sidePots: SidePots[];
    minBet: number;
    clearCards: false;
    phase: Phase;
    playerHierarchy: HierarchyPlayer[] | HierarchyPlayer[][];
    showDownMessages: ShowDownMessage[];
    playerAnimationSwitchboard: PlayerAnimationSwitchboard;
}

export interface GameStateBase<T extends Player | PlayerWithSidePotStack> extends Omit<GameState, "playerAnimationSwitchboard"> {
    players: T[];
}

export interface PopCards {
    mutableDeckCopy: CardType[];
    chosenCards: CardType[];
}

export type LowStraightRes = {
    isLowStraight: boolean;
    concurrentCardValuesLow: number[];
};

export type StraightRes = {
    isStraight: boolean;
    isLowStraight: boolean;
    concurrentCardValues: number[];
    concurrentCardValuesLow: never[];
} | {
    isStraight: boolean;
    isLowStraight: true;
    concurrentCardValues: number[];
    concurrentCardValuesLow: number[];
};

export type StraightFlushRes = {
    isStraightFlush: undefined;
    isLowStraightFlush: undefined;
    concurrentSFCardValues: undefined;
    concurrentSFCardValuesLow: undefined;
} | {
    isStraightFlush: boolean;
    isLowStraightFlush: boolean;
    concurrentSFCardValues: number[];
    concurrentSFCardValuesLow: number[] | never[];
};

export type Quad = {
    face: keyof ValueMap;
    value: ValueMap[keyof ValueMap];
};

export type FrequencyHistogramMetaData = {
    pairs: Quad[];
    tripples: Quad[];
    quads: Quad[];
};

export type Histogram = {
    frequencyHistogram: Record<keyof ValueMap, number>;
    suitHistogram: Record<Suit, number>;
};
