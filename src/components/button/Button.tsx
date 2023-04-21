import React from "react";

import "./Button.css";
import { useSound } from "../../hooks/useSound";

interface ButtonProps {
    children: React.ReactNode;
    className: string;
    onClick: () => void;
    sound: HTMLAudioElement | undefined;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const { children, className, onClick, sound, disabled } = props;
    const { playSound } = useSound(sound, true);

    function onClickHandler() {
        onClick();
        playSound();
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
