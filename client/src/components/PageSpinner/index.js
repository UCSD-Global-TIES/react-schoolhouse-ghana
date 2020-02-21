import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

function PageSpinner(props) {
    return (<>
        {/* Replace with user portal skeleton */}
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <div style={{ margin: "auto" }}>
          <FontAwesomeIcon icon={faSpinner} size="2x" spin />
        </div>

      </div>
    </>)
}

export default PageSpinner;