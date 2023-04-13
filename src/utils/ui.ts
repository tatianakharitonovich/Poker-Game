import { Player, PlayerBet, Sound, SoundName } from "../types";

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

export function getSound(content: string | null, sounds: Sound[]): HTMLAudioElement | undefined {
    if (content?.includes("Check")) {
        return sounds.find((sound) => sound.name === SoundName.check)?.audio;
    }
    if (content?.includes("Call") || content?.includes("Bet") || content?.includes("Raise")) {
        return sounds.find((sound) => sound.name === SoundName.rise)?.audio;
    }
    if (content?.includes("FOLD")) {
        return sounds.find((sound) => sound.name === SoundName.fold)?.audio;
    }
    if (content?.includes("All-In!")) {
        return sounds.find((sound) => sound.name === SoundName.allin)?.audio;
    }
}
