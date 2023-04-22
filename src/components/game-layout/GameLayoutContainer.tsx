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
                userName={rootStore.userName}
                gender={rootStore.gender}
                playersNumber={rootStore.playersNumber}
                setState={rootStore.setState}
                runGameLoop={rootStore.gameLoopProcessor.runGameLoop}
                winner={rootStore.winner}
            />
        );
    }
}
