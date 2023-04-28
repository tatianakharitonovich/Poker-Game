import React from "react";
import { observer } from "mobx-react";
import { rootStore } from "../../stores/rootStore";
import { GameLayout } from "./GameLayout";

@observer
export class GameLayoutContainer extends React.Component {
    public render() {
        return (
            <GameLayout
                state={rootStore.state}
                userName={rootStore.gameInfoStore.userName}
                gender={rootStore.gameInfoStore.gender}
                playersNumber={rootStore.gameInfoStore.playersNumber}
                setState={rootStore.setState}
                runGameLoop={rootStore.gameLoopProcessor.runGameLoop}
                winner={rootStore.gameInfoStore.winner}
            />
        );
    }
}
