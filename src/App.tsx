import React, { useState } from "react";
import "./App.css";
import { GameLayout } from "./components/GameLayout";
import { RegistrationForm } from "./components/registration-form/RegistrationForm";
import { Gender } from "./types";

export const App: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [gender, setGender] = useState<Gender>();
    const [isSubmit, setIsSubmit] = useState(false);

    return (
        <div className="App">
            <div className="App-wrap" style={{ height: isSubmit ? "100%" : "auto" }}>
                {!isSubmit ?
                    (
                        <RegistrationForm
                            userName={userName}
                            gender={gender}
                            userNameHandler={setUserName}
                            genderHandler={setGender}
                            submitHandler={setIsSubmit}
                        />
                    )
                    : (
                        <GameLayout userName={userName} gender={gender} />
                    )
               }
            </div>
        </div>
    );
};
