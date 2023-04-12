import { Player, PlayerBet } from "../types";

export const renderActionButtonText: (highBet: number, betInputValue: number, activePlayer: Player) => PlayerBet | undefined =
    (highBet, betInputValue, activePlayer) => {
        if ((highBet === 0) && (betInputValue === 0)) {
            return "Check";
        }
        if ((highBet === betInputValue)) {
            return "Call";
        }
        if ((highBet === 0) && (betInputValue > highBet)) {
            return "Bet";
        }
        if ((betInputValue < highBet) || (betInputValue === activePlayer.chips + activePlayer.bet)) {
            return "All-In!";
        }
        if (betInputValue > highBet) {
            return "Raise";
        }
    };

export function getSound(content: string | null): string | undefined {
    if (content?.includes("Check")) {
        return "assets/sounds/check.mp3";
    }
    if (content?.includes("Call") || content?.includes("Bet") || content?.includes("Raise")) {
        return "assets/sounds/rise.mp3";
    }
    if (content?.includes("FOLD")) {
        return "assets/sounds/fold.mp3";
    }
    if (content?.includes("All-In!")) {
        return "assets/sounds/allin.mp3";
    }
}
