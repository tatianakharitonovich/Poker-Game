import { CardType, PokerHand, Suit, ValueMap } from "../types";

export function determineBestHand(allCards: CardType[]): PokerHand {
    const cardCounts: { [key in keyof ValueMap]?: number } = {};
    const suitCounts: { [key in Suit]?: number } = {};
    let hasAce = false;
    let straightCount = 0;

    allCards.forEach((card) => {
        cardCounts[card.cardRank] = (cardCounts[card.cardRank] || 0) + 1;
        suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        if (card.cardRank === "A") { hasAce = true; }
    });

    const cardCountsArr = Object.values(cardCounts);
    const suitCountsArr = Object.values(suitCounts);

    // Check for royal flush
    if (hasAce && suitCountsArr.includes(5)) {
        const royalFlush = ["10", "J", "Q", "K", "A"].every((card) => cardCounts[card as keyof ValueMap]);
        if (royalFlush) { return PokerHand.RoyalFlush; }
    }

    const cardRanks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

    // Check for straight flush
    for (const suit of Object.keys(suitCounts)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (suitCounts[suit as Suit]! < 5) { continue; }

        straightCount = 0;
        for (const card of cardRanks) {
            if (cardCounts[card as keyof ValueMap]) {
                straightCount++;
                if (straightCount === 5) { break; }
            } else {
                straightCount = 0;
            }
        }

        if (straightCount === 5) {
            return PokerHand.StraightFlush;
        }
    }
    // Check for four of a kind
    if (cardCountsArr.includes(4)) {
        return PokerHand.FourOfAKind;
    }

    // Check for full house
    if (cardCountsArr.includes(3) && cardCountsArr.includes(2)) {
        return PokerHand.FullHouse;
    }

    // Check for flush
    if (suitCountsArr.includes(5)) {
        return PokerHand.Flush;
    }

    // Check for straight
    for (const card of cardRanks) {
        if (cardCounts[card as keyof ValueMap]) {
            straightCount++;
            if (straightCount === 5) {
                return PokerHand.Straight;
            }
        } else {
            straightCount = 0;
        }
    }

    // Check for three of a kind
    if (cardCountsArr.includes(3)) {
        return PokerHand.ThreeOfAKind;
    }

    // Check for two pair
    if (cardCountsArr.filter((count) => count === 2).length === 2) {
        return PokerHand.TwoPair;
    }

    // Check for pair
    if (cardCountsArr.includes(2)) {
        return PokerHand.Pair;
    }

    // Otherwise, return high card
    return PokerHand.HighCard;
}
