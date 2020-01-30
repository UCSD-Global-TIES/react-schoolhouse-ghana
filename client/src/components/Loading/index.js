import React from "react";
import loading from "../../assets/loading.svg";

const Loading = () => (
    <div style={{ "height": "85vh", "display": "flex" }} className="spinner">
        <div className="m-auto">
            <h1 className="h1">Loading...</h1>
            <img src={loading} alt="Loading" />
        </div>
    </div>
);

export default Loading;