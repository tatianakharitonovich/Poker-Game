import React from "react";

interface PlayerAvatarProps {
    avatarURL: string;
    isActive?: boolean;
    name: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = (props) => {
    const { avatarURL, isActive, name } = props;

    return (
        <>
            <img
                className={`player-avatar-image${(isActive ? " activePlayer" : "")}`}
                src={avatarURL}
                alt="Player Avatar"
            />
            <h5
                className="player-avatar-name"
                style={{ fontSize: (name.length < 14) ? 16 : 14 }}
            >
                {`${name}`}
            </h5>
        </>
    );
};
