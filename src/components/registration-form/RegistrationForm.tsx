import React, { useEffect } from "react";
import { Button } from "../button/Button";
import { Gender, Sound, SoundName } from "../../types";

import "./RegistrationForm.css";
import { useSound } from "../../hooks/useSound";

interface RegistrationFormProps {
    loadedSounds: Sound[];
    userName: string;
    gender: Gender | undefined;
    playersNumber: string;
    setIsSubmit: (value: boolean) => void;
    setUserName: (name: string) => void;
    setGender: (gender: Gender | undefined) => void;
    setPlayersNumber: (number: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = (props) => {
    const {
        loadedSounds,
        userName,
        gender,
        playersNumber,
        setIsSubmit,
        setUserName,
        setGender,
        setPlayersNumber,
    } = props;

    const buttomSound = loadedSounds.find((sound) => sound.name === SoundName.positive)?.audio;

    const menuSound = loadedSounds.find((sound) => sound.name === SoundName.menu)?.audio;

    const { playSound } = useSound(menuSound, false);

    if (menuSound) {
        menuSound.volume = 0.01;
    }

    useEffect(() => {
        return () => {
            menuSound?.pause();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const playMusic: () => void = () => {
        playSound();
    };

    const playersNumberIsValid: () => boolean = () => {
        if (playersNumber === "2" ||
        playersNumber === "3" ||
        playersNumber === "4" ||
        playersNumber === "5") {
            return true;
        }
        return false;
    };

    return (
        <div className="registration-form" data-testid="registration-form">
            <h1 className="registration-form-title">
                Welcome to our online casino!
            </h1>
            <div className="registration-form-item">
                <label className="registration-form-label">Please enter your name</label>
                <input
                    className="registration-form-name-input"
                    type="text"
                    data-test="name-input"
                    value={userName}
                    onChange={(e) => { setUserName(e.target.value); playMusic(); }}
                />
            </div>
            <div className="registration-form-item">
                <label className="registration-form-label">Enter the number of players from 2 to 5</label>
                <input
                    className="registration-form-name-input"
                    type="number"
                    min={2}
                    max={5}
                    placeholder="2"
                    data-test="playersNumber-input"
                    value={playersNumber}
                    onChange={(e) => { setPlayersNumber(e.target.value); playMusic(); }}
                />
            </div>
            <div className="registration-form-item">
                <legend className="registration-form-label">Choose your gender</legend>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="male"
                            data-testid="male-input"
                            checked={gender === "male"}
                            onChange={(e) => { setGender(e.target.value as Gender); playMusic(); }}
                        />
                        Male
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="female"
                            data-test="female-input"
                            checked={gender === "female"}
                            onChange={(e) => { setGender(e.target.value as Gender); playMusic(); }}
                        />
                        Female
                    </label>
                </div>
            </div>
            <Button
                className="action-button"
                disabled={userName === "" || !gender || !playersNumberIsValid()}
                onClick={() => setIsSubmit(true)}
                sound={buttomSound}
            >
                Submit
            </Button>
            <img className="registration-form-background" src="assets/images/cards.svg" alt="cards" />
        </div>
    );
};
