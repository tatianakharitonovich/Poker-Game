import React from "react";
import { ShowDownMessage } from "../../types";

import "./ShowdownMessage.css";

interface ShowdownMessageProps {
    message: ShowDownMessage;
}

export const ShowdownMessage: React.FC<ShowdownMessageProps> = ({ message }) => {
    const { users, prize, rank } = message;

    if (users.length > 1) {
        return (
            <>
                <div>
                    <span>
                        {`${users.length} players `}
                    </span>
                    <span>
                        {`split the pot with a `}
                    </span>
                    <span className="message-rank">
                        {`${rank}! `}
                    </span>
                </div>
                {
                    users.map(user => {
                        return (
                            <div key={user}>
                                <span className="message-player">
                                    {`${user} `}
                                </span>
                                <span>
                                    {`takes `}
                                </span>
                                <span className="message-earnings">
                                    {`${prize} chips `}
                                </span>
                            </div>
                        );
                    })
                }
            </>
        );
    } if (users.length === 1) {
        return (
            <div>
                <span className="message-player">
                    {`${users[0]} `}
                </span>
                <span>
                    wins
                </span>
                <span className="message-earnings">
                    {` ${prize} chips `}
                </span>
                <span>with</span>
                <span className="message-rank">
                    {` ${rank}!`}
                </span>
            </div>
        );
    }

    return null;
};
