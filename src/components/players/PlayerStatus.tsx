import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import "./PlayerStatus.css";
import { getSound } from "../../utils/ui";
import { Sound } from "../../types";

interface PlayerStatusProps {
    index: number;
    isActive: boolean;
    content: string | null;
    sounds: Sound[];
    endTransition: (index: number) => void;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = (props) => {
    const { index, isActive, content, sounds, endTransition } = props;
    const statusSound = getSound(content, sounds);

    if (statusSound) {
        document.body.appendChild(statusSound);
    }

    useEffect(() => {
        statusSound?.play().catch((e) => { throw new Error(`${e}`); });
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
