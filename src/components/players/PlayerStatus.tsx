import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { getSound } from "../../utils/ui";

import "./PlayerStatus.css";
import { useSound } from "../../hooks/useSound";

interface PlayerStatusProps {
    index: number;
    isActive: boolean;
    content: string | null;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = observer((props) => {
    const { loadedSounds, gameLoopProcessor: { endTransition } } = useRootStore();
    const { index, isActive, content } = props;
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
});
