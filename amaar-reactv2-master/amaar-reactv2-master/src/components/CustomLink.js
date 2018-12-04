import React          from "react";
import PropTypes      from "prop-types";
import { withRouter } from "react-router";
import { Link }       from "react-router-dom";

function CustomLink({ className, to, location : { pathname }, children }) {
    return (
        <Link
            className={ `${ pathname.indexOf(to) === 0 ? "active " : "" }${className}` }
            to={ to }
        >
            { children }
        </Link>
    );
}

CustomLink.propTypes = {
    to        : PropTypes.string.isRequired,
    className : PropTypes.string
};

CustomLink.defaultProps = { className : "" };

export default withRouter(CustomLink);