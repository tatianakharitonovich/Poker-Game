import React, { useState, useEffect } from "react";
import {
    CardType,
    HierarchyPlayer,
    Phase,
    Player,
    PlayerAnimationSwitchboard,
    ShowDownMessage,
    Sound,
    SoundName,
} from "../../types";
import { ActionButtons } from "../action-buttons/ActionButtons";
import { ActionMenu } from "../action-menu/ActionMenu";
import { Board } from "../Board";
import { Card } from "../cards/Card";
import { Showdown } from "../show-down/Showdown";

import "./Game.css";
import { Button } from "../button/Button";

interface GameProps {
    highBet: number;
    players: Player[];
    activePlayerIndex: number;
    phase: Phase;
    pot: number;
    loading: boolean;
    dealerIndex: number;
    clearCards: boolean;
    playerAnimationSwitchboard: PlayerAnimationSwitchboard;
    communityCards: CardType[];
    showDownMessages: ShowDownMessage[];
    popAnimationState: (index: number) => void;
    playerHierarchy: HierarchyPlayer[];
    handleNextRound: () => void;
    betInputValue: number;
    sounds: Sound[];
    handleBetInputSubmit: (bet: string, min: string, max: string) => void;
    handleFold: () => void;
    handleBetInputChange: (val: readonly number[], max: number) => void;
    submitHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Game: React.FC<GameProps> = (props) => {
    const {
        highBet,
        players,
        activePlayerIndex,
        phase,
        pot,
        loading,
        dealerIndex,
        clearCards,
        playerAnimationSwitchboard,
        communityCards,
        popAnimationState,
        showDownMessages,
        playerHierarchy,
        sounds,
        handleNextRound,
        handleBetInputSubmit,
        betInputValue,
        handleFold,
        handleBetInputChange,
        submitHandler,
    } = props;

    const [isSounds, setIsSounds] = useState(true);
    const [isMusic, setIsMusic] = useState(true);

    const mainSound = sounds.find((sound) => sound.name === SoundName.main)?.audio;

    useEffect(() => {
        if (mainSound) {
            mainSound.loop = true;
            mainSound.volume = 0.007;
            mainSound.muted = false;
        }
        mainSound?.play().catch((e) => { throw new Error(`${e}`); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const exitHandler = () => {
        submitHandler(false);

        if (isMusic) {
            toggleMusic();
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
                    sounds={sounds}
                />
            );
        });
    };

    return (
        <div className="game">
            <img className="game-logo" src="assets/images/lasvegas.svg" alt="LasVegas" />
            <img className="game-background" src="assets/images/city.svg" alt="LasVegas" />
            <Button
                className="game-return-button secondary action-button"
                onClick={() => exitHandler()}
                sound={sounds.find((sound) => sound.name === SoundName.negative)?.audio}
            >
                <img src="assets/images/exit.svg" alt="Exit" />
            </Button>
            <div className="game-soundwrap">
                <Button
                    className={`action-button secondary ${!isMusic && "crossed"}`}
                    onClick={() => toggleMusic()}
                    sound={sounds.find((sound) => sound.name === SoundName.positive)?.audio}
                >
                    <img src="assets/images/music.svg" alt="Sound" />
                </Button>
                <Button
                    className={`action-button secondary ${!isSounds && "crossed"}`}
                    onClick={() => toggleSounds()}
                    sound={sounds.find((sound) => sound.name === SoundName.positive)?.audio}
                >
                    <img src="assets/images/sound.svg" alt="Sound" />
                </Button>
            </div>
            <div className="game-container">
                <img className="game-container-image" src="assets/images/table.svg" alt="Poker Table" />
                <Board
                    players={players}
                    activePlayerIndex={activePlayerIndex}
                    dealerIndex={dealerIndex}
                    clearCards={clearCards}
                    phase={phase}
                    communityCards={communityCards}
                    popAnimationState={popAnimationState}
                    playerAnimationSwitchboard={playerAnimationSwitchboard}
                    sounds={sounds}
                />
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
                        showDownMessages={showDownMessages}
                        playerHierarchy={playerHierarchy}
                        players={players}
                        handleNextRound={handleNextRound}
                        sounds={sounds}
                    />
                )}
            <div className="game-action">
                <div className="game-action-buttons">
                    {((!players[activePlayerIndex].isFake) && (phase !== "showdown")) && (
                        <ActionButtons
                            activePlayerIndex={activePlayerIndex}
                            highBet={highBet}
                            players={players}
                            betInputValue={betInputValue}
                            handleFold={handleFold}
                            handleBetInputSubmit={handleBetInputSubmit}
                            sounds={sounds}
                        />
                    )}
                </div>
                <div className="game-action-slider">
                    {(!loading) && (
                        <ActionMenu
                            activePlayerIndex={activePlayerIndex}
                            highBet={highBet}
                            players={players}
                            phase={phase}
                            handleBetInputChange={handleBetInputChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
