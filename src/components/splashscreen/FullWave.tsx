import React from "react";

import "./FullWave.css";

export const FullWave: React.FC = () => {
    return (
        <div className="full-wave">
            <svg
                width="1440"
                height="358"
                viewBox="0 0 1440 358"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M-53 188.707C-22.297 144.653 91.7604 4.00173 281 22.7014C561.5 50.4189 608.856 337 960.565 337C1173.76 337 1467.4 71.9925 1518 22.7013" stroke="url(#paint0_linear_778_585)" strokeWidth="41" />
                <defs>
                    <linearGradient
                        id="paint0_linear_778_585"
                        x1="1518"
                        y1="75.7485"
                        x2="9.76969"
                        y2="98.2142"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#0EFFD2" stopOpacity="0.81" />
                        <stop offset="0.468708" stopColor="#0EFFD2" stopOpacity="0.12" />
                        <stop offset="0.791559" stopColor="#0EFFD2" stopOpacity="0.74" />
                        <stop offset="1" stopColor="#0EFFD2" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
