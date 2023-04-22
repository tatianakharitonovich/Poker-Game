import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { getSound } from "../../utils/ui";
import { useSound } from "../../hooks/useSound";
import { Sound } from "../../types";

import "./PlayerStatus.css";

interface PlayerStatusProps {
    loadedSounds: Sound[];
    endTransition: (indexPlayer: number) => void;
    index: number;
    isActive: boolean;
    content: string | null;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = (props) => {
    const { loadedSounds, endTransition, index, isActive, content } = props;
    const statusSound = getSound(content, loadedSounds);

    const { playSound } = useSound(statusSound, true);

    useEffect(() => {
        playSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    return (
        <CSSTransition
            in={isActive}
            timeout={{
                appear: 0,
                enter: 0,
                exit: 250,
            }}
            classNames="transitionable-player-status"
            onEntered={() => {
                setTimeout(() => {
                    endTransition(index);
                }, 1000);
            }}
        >
            <div className={`player-status ${!isActive && "reset"}`}>
                {content}
            </div>
        </CSSTransition>
    );
};
