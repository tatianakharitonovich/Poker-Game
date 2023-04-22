import * as React from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../hooks/useRootStore";
import { ActionMenu } from "./ActionMenu";

export const ActionMenuContainer: React.FC = observer(() => {
    const {
        minBet,
        maxBet,
        isShow,
        betProcessor: {
            handleBetInputChange,
        },
    } = useRootStore();

    return (
        <ActionMenu
            minBet={minBet}
            maxBet={maxBet}
            isShow={isShow}
            handleBetInputChange={handleBetInputChange}
        />
    );
});
