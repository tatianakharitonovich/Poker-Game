import React from "react";

import "./Button.css";

interface ButtonProps {
    children: React.ReactNode;
    className: string;
    onClick: () => void;
    sound: HTMLAudioElement | undefined;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const { children, className, onClick, sound, disabled } = props;

    if (sound) {
        document.body.appendChild(sound);
    }

    function onClickHandler() {
        onClick();
        sound?.play().catch((e) => { throw new Error(`${e}`); });
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
