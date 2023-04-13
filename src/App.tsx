import React, { useEffect, useState } from "react";
import { Sound, SoundName } from "./types";
import { LoadingOverlay } from "./components/loading-overlay/LoadingOverlay";
import { MainLayout } from "./components/MainLayout";

import "./App.css";

const sounds: Sound[] = [
    { name: SoundName.main, src: "assets/sounds/main.mp3", audio: new Audio("assets/sounds/main.mp3") },
    { name: SoundName.card, src: "assets/sounds/card.mp3", audio: new Audio("assets/sounds/card.mp3") },
    { name: SoundName.check, src: "assets/sounds/check.mp3", audio: new Audio("assets/sounds/check.mp3") },
    { name: SoundName.positive, src: "assets/sounds/positive-tone.wav", audio: new Audio("assets/sounds/positive-tone.wav") },
    { name: SoundName.negative, src: "assets/sounds/negative-tone.wav", audio: new Audio("assets/sounds/negative-tone.wav") },
    { name: SoundName.rise, src: "assets/sounds/rise.mp3", audio: new Audio("assets/sounds/rise.mp3") },
    { name: SoundName.fold, src: "assets/sounds/fold.mp3", audio: new Audio("assets/sounds/fold.mp3") },
    { name: SoundName.allin, src: "assets/sounds/allin.mp3", audio: new Audio("assets/sounds/allin.mp3") },
    { name: SoundName.finish, src: "assets/sounds/finish.mp3", audio: new Audio("assets/sounds/finish.mp3") },
];

export const App: React.FC = () => {
    const [loadedSounds, setLoadedSounds] = useState<Sound[]>([]);

    useEffect(() => {
        const loaded: Sound[] = [];
        sounds.forEach((sound) => {
            sound.audio.addEventListener("canplaythrough", () => {
                loaded.push(sound);
                if (loaded.length === sounds.length) {
                    setLoadedSounds(loaded);
                }
            });
        });
    }, []);

    return (
        <div className="App">
            {loadedSounds.length === sounds.length ?
                <MainLayout sounds={loadedSounds} />
                : (
                    <div className="App-wrap">
                        <LoadingOverlay />
                    </div>
                )
            }
        </div>
    );
};
