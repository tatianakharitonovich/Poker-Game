import * as React from "react";
import { CardType, HierarchyPlayer, Phase, Player, PlayerAnimationSwitchboard, ShowDownMessage } from "../../types";
import { ActionButtons } from "../action-buttons/ActionButtons";
import { ActionMenu } from "../action-menu/ActionMenu";
import { Board } from "../Board";
import { Card } from "../cards/Card";
import { Showdown } from "../show-down/Showdown";

import "./Game.css";

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
    handleBetInputSubmit: (bet: string, min: string, max: string) => void;
    handleFold: () => void;
    handleBetInputChange: (val: readonly number[], max: number) => void;
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
        handleNextRound,
        handleBetInputSubmit,
        betInputValue,
        handleFold,
        handleBetInputChange,
    } = props;

    const renderCommunityCards = (clearAnimation: boolean) => {
        return communityCards.map((card) => {
            const cardData = { ...card };
            if (clearAnimation) {
                cardData.animationDelay = 0;
            }
            return (
                <Card key={`${card.cardRank}${card.suit}`} cardData={cardData} isRobot={false} />
            );
        });
    };

    return (
        <div className="game">
            <div className="game-container">
                <img className="game-container-image" src="assets/table.svg" alt="Poker Table" />
                <Board
                    players={players}
                    activePlayerIndex={activePlayerIndex}
                    dealerIndex={dealerIndex}
                    clearCards={clearCards}
                    phase={phase}
                    popAnimationState={popAnimationState}
                    playerAnimationSwitchboard={playerAnimationSwitchboard}
                />
                <div className="game-community">
                    {renderCommunityCards(false)}
                </div>
                <div className="game-pot">
                    <img
                        className="game-pot-img"
                        style={{ height: 54, width: 54 }}
                        src="./assets/pot.svg"
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
