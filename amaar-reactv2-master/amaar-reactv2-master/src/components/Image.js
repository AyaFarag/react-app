import React, { PureComponent } from "react";
import PropTypes                from "prop-types";

import { COMPANY_IMAGE_PLACEHOLDER } from "../config";

class ImageElem extends PureComponent {
    state = { src : COMPANY_IMAGE_PLACEHOLDER };

    unmounted = false;

    componentDidMount() {
        if (this.props.src) this.load();
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    load() {
        const image = new Image();
        image.onload = () => !this.unmounted && this.setState({ src : this.props.src });
        image.src = this.props.src;
    }

    render() {
        return <img { ...this.props } src={ this.state.src } />;
    }
}

export default ImageElem;