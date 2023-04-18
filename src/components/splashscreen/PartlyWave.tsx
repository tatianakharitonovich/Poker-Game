import React from "react";

import "./PartlyWave.css";

export const PartlyWave: React.FC = () => {
    return (
        <div className="partly-wave">
            <svg
                width="788"
                height="433"
                viewBox="0 0 788 433"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M-91 183.566C-67.1299 259.711 27.9908 412 217.513 412C454.415 412 669.737 36.8828 785 20.9999"
                    stroke="url(#paint0_linear_778_561)"
                    strokeWidth="41"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_778_561"
                        x1="785"
                        y1="88.7424"
                        x2="-136.205"
                        y2="91.9214"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.144136" stopColor="#0EFFD2" stopOpacity="0" />
                        <stop offset="0.512992" stopColor="#0EFFD2" stopOpacity="0.12" />
                        <stop offset="0.869839" stopColor="#0EFFD2" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#0EFFD2" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
