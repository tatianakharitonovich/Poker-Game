import * as React from "react";

import "./LoadingOverlay.css";

export const LoadingOverlay: React.FC = () => (
    <div className="loading" data-test="loading-overlay">
        <div className="loading-wrap">
            <img className="loading-wrap-img" src="/assets/images/chip.svg" alt="Loading..." />
            <img className="loading-wrap-img" src="/assets/images/chip.svg" alt="Loading..." />
            <img className="loading-wrap-img" src="/assets/images/chip.svg" alt="Loading..." />
        </div>
    </div>
);
