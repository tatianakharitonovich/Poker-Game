import React from "react";
import { Gender } from "../../types";

import "./RegistrationForm.css";

interface RegistrationFormProps {
    userName: string;
    gender: Gender | undefined;
    userNameHandler: React.Dispatch<React.SetStateAction<string>>;
    genderHandler: React.Dispatch<React.SetStateAction<Gender | undefined>>;
    submitHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = (props) => {
    const { userName, gender, submitHandler, userNameHandler, genderHandler } = props;

    return (
        <div className="App">
            <div className="App-wrap">
                <div className="registration-form" data-testid="registration-form">
                    <h1>
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
                    <button
                        className="action-button"
                        data-testid="form-save-button"
                        disabled={userName === "" || !gender}
                        onClick={() => submitHandler(true)}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
