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
