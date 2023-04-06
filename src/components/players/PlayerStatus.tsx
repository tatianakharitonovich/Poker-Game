import React from "react";
import { CSSTransition } from "react-transition-group";

import "./PlayerStatus.css";

interface PlayerStatusProps {
    index: number;
    isActive: boolean;
    content: string | null;
    endTransition: (index: number) => void;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = (props) => {
    const { index, isActive, content, endTransition } = props;

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
