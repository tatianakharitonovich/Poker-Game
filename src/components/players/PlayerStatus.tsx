import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

import "./PlayerStatus.css";
import { getSound } from "../../utils/ui";

interface PlayerStatusProps {
    index: number;
    isActive: boolean;
    content: string | null;
    endTransition: (index: number) => void;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = (props) => {
    const { index, isActive, content, endTransition } = props;
    const [audio] = useState(new Audio(getSound(content)));
    document.body.appendChild(audio);

    useEffect(() => {
        // audio.play().catch((e) => { throw new Error(`${e}`); });
    }, [audio, content]);

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
