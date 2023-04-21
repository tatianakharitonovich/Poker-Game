import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { Player, SoundName } from "../../types";
import { ActionButtons } from "../action-buttons/ActionButtons";
import { ActionMenu } from "../action-menu/ActionMenu";
import { Board } from "../Board";
import { Card } from "../cards/Card";
import { Showdown } from "../show-down/Showdown";
import { Button } from "../button/Button";

import "./Game.css";
import { ExitButton } from "../ExitButton";
import { useSound } from "../../hooks/useSound";

const imageUrl = "assets/images/table.svg";

export const Game: React.FC = observer(() => {
    const { loadedSounds, state } = useRootStore();

    const {
        players,
        activePlayerIndex,
        phase,
        pot,
        communityCards,
    } = state;

    const [isSounds, setIsSounds] = useState(true);
    const [isMusic, setIsMusic] = useState(true);
    const [loaded, setLoaded] = useState(false);

    const mainSound = loadedSounds.find((sound) => sound.name === SoundName.main)?.audio;

    const { playSound } = useSound(mainSound, false);

    useEffect(() => {
        if (mainSound) {
            mainSound.loop = true;
            mainSound.volume = 0.007;
            mainSound.muted = false;
        }
        playSound();

        return () => {
            mainSound?.pause();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            setLoaded(true);
        };
    }, []);

    const toggleMusic = () => {
        setIsMusic(!isMusic);
        if (mainSound) {
            mainSound.muted = !mainSound.muted;
        }
    };

    const toggleSounds = () => {
        setIsSounds(!isSounds);
        const audios = document.getElementsByTagName("audio");
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < audios.length; i++) {
            audios[i].muted = !audios[i].muted;
        }
    };

    const renderCommunityCards: (clearAnimation: boolean, addClass: string) => JSX.Element[] =
    (clearAnimation: boolean, addClass: string) => {
        return communityCards.map((card) => {
            const cardData = { ...card };
            if (clearAnimation) {
                cardData.animationDelay = 0;
            }
            return (
                <Card
                    key={`${card.cardRank}${card.suit}`}
                    cardData={cardData}
                    isRobot={false}
                    addClass={addClass}
                />
            );
        });
    };

    if (loaded) {
        return (
            <div className="game">
                <img className="game-logo" src="assets/images/lasvegas.svg" alt="LasVegas" />
                <img className="game-background" src="assets/images/city.svg" alt="LasVegas" />
                {(phase !== "showdown") && <ExitButton />}
                {(phase !== "showdown") &&
                    (
                        <div className="game-soundwrap">
                            <Button
                                className={`action-button secondary ${!isMusic && "crossed"}`}
                                onClick={() => toggleMusic()}
                                sound={loadedSounds.find((sound) => sound.name === SoundName.positive)?.audio}
                            >
                                <img src="assets/images/music.svg" alt="Sound" />
                            </Button>
                            <Button
                                className={`action-button secondary ${!isSounds && "crossed"}`}
                                onClick={() => toggleSounds()}
                                sound={loadedSounds.find((sound) => sound.name === SoundName.positive)?.audio}
                            >
                                <img src="assets/images/sound.svg" alt="Sound" />
                            </Button>
                        </div>
                    )
                }
                <div className="game-container">
                    <img className="game-container-image" src={imageUrl} alt="Poker Table" />
                    <Board />
                    <div className="game-community">
                        {renderCommunityCards(false, "isHover")}
                    </div>
                    <div className="game-pot">
                        <img
                            className="game-pot-img"
                            style={{ height: 54, width: 76 }}
                            src="./assets/images/pot.svg"
                            alt="Pot Value"
                        />
                        <h4 className="game-pot-text"> ${pot} </h4>
                    </div>
                </div>
                {(phase === "showdown")
                    && (
                        <Showdown
                            renderCommunityCards={renderCommunityCards}
                        />
                    )}
                <div className="game-action">
                    <div className="game-action-buttons">
                        {((!(players as Player[])[activePlayerIndex as number].isFake) && (phase !== "showdown")) && (
                            <ActionButtons />
                        )}
                    </div>
                    <div className="game-action-slider">
                        <ActionMenu />
                    </div>
                </div>
            </div>
        );
    }
    return null;
});
