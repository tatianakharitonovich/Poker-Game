interface UseSound {
    playSound: () => void;
}

export function useSound(sound: HTMLAudioElement | undefined, isAddToDom: boolean): UseSound {
    const indexSound = [...document.body.querySelectorAll("audio")].find(el => el.src === sound?.src);

    if (isAddToDom) {
        if (sound && !indexSound) {
            document.body.appendChild(sound);
        }
    }

    function playSound(): void {
        sound?.play().catch((e) => { throw new Error(`${e}`); });
    }

    return { playSound };
}
