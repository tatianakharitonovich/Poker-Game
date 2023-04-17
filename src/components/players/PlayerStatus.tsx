import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { getSound } from "../../utils/ui";

import "./PlayerStatus.css";

interface PlayerStatusProps {
    index: number;
    isActive: boolean;
    content: string | null;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = observer((props) => {
    const { loadedSounds, state, setState } = useRootStore();
    const { index, isActive, content } = props;
    const statusSound = getSound(content, loadedSounds);

    if (statusSound) {
        document.body.appendChild(statusSound);
    }

    useEffect(() => {
        statusSound?.play().catch((e) => { throw new Error(`${e}`); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const endTransition: (indexPlayer: number) => void = (indexPlayer: number) => {
        const { playerAnimationSwitchboard } = state;
        const persistContent = playerAnimationSwitchboard[indexPlayer].content;
        const newAnimationSwitchboard = {
            ...playerAnimationSwitchboard,
            ...{ [indexPlayer]: { isAnimating: false, content: persistContent } },
        };
        setState({ ...state, playerAnimationSwitchboard: newAnimationSwitchboard });
    };

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
