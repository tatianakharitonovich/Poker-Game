import React, { useState } from "react";

import "./Button.css";

interface ButtonProps {
    children: React.ReactNode;
    className: string;
    onClick: () => void;
    sound: string | undefined;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const { children, className, onClick, sound, disabled } = props;

    const [audio] = useState(new Audio(sound));

    document.body.appendChild(audio);

    function onClickHandler() {
        onClick();
        audio.currentTime = 0;
        audio.play().catch((e) => { throw new Error(`${e}`); });
    }

    return (
        <button
            className={className}
            disabled={disabled}
            onClick={() => onClickHandler()}
        >
            {children}
        </button>
    );
};
