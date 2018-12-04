import React     from "react";
import PropTypes from "prop-types";

import Loading from "../components/Loading";

function LoadableContainer({ isLoading, children }) {
    if (!isLoading) return children;

    return (
        <div className="w-100">
            <Loading className="m-5" />
        </div>
    );
}

LoadableContainer.propTypes = { isLoading : PropTypes.bool.isRequired };

export default LoadableContainer;