import React from "react";
import { Gender, Sound, SoundName } from "../../types";

import "./RegistrationForm.css";
import { Button } from "../button/Button";

interface RegistrationFormProps {
    userName: string;
    gender: Gender | undefined;
    sounds: Sound[];
    playersNumber: string;
    userNameHandler: React.Dispatch<React.SetStateAction<string>>;
    genderHandler: React.Dispatch<React.SetStateAction<Gender | undefined>>;
    playersNumberHandler: React.Dispatch<React.SetStateAction<string>>;
    submitHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = (props) => {
    const {
        userName,
        gender,
        sounds,
        playersNumber,
        submitHandler,
        userNameHandler,
        genderHandler,
        playersNumberHandler,
    } = props;

    const buttomSound = sounds.find((sound) => sound.name === SoundName.positive)?.audio;

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
                    onChange={(e) => userNameHandler(e.target.value)}
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
                    onChange={(e) => playersNumberHandler(e.target.value)}
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
                            onChange={(e) => genderHandler(e.target.value as Gender)}
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
                            onChange={(e) => genderHandler(e.target.value as Gender)}
                        />
                        Female
                    </label>
                </div>
            </div>
            <Button
                className="action-button"
                data-testid="form-save-button"
                disabled={userName === "" || !gender || !playersNumberIsValid()}
                onClick={() => submitHandler(true)}
                sound={buttomSound}
            >
                Submit
            </Button>
            <img className="registration-form-background" src="assets/images/cards.svg" alt="cards" />
        </div>
    );
};
