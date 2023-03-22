import * as React from "react";

import "./LoadingOverlay.css";

export const LoadingOverlay: React.FC = () => (
    <div className="loading">
        <div className="loading-wrap">
            <img className="loading-wrap-img" src="/assets/chip.svg" alt="Loading..." />
            <img className="loading-wrap-img" src="/assets/chip.svg" alt="Loading..." />
            <img className="loading-wrap-img" src="/assets/chip.svg" alt="Loading..." />
        </div>
    </div>
);