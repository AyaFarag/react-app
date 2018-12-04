import React, {
    Component,
    PureComponent
}                from "react";
import PropTypes from "prop-types";

const STARS = [1, 2, 3, 4, 5];

class Star extends PureComponent {
    onMouseEnter = () => this.props.onHover(this.props.id);

    onClick = () => this.props.onClick(this.props.id);

    render() {
        const { value, id, readOnly } = this.props;

        const conditionalProps = {};

        if (!readOnly) {
            conditionalProps.onClick      = this.onClick;
            conditionalProps.onMouseEnter = this.onMouseEnter;
        }

        return (
            <img
                src={ `/images/star${value >= id ? "-orange" : ""}.png` }
                { ...conditionalProps }
            />
        );
    }
}

class Rating extends Component {
    static propTypes    = { readOnly : PropTypes.bool };
    static defaultProps = { readOnly : false };

    constructor(props) {
        super();
        this.state = { preview : props.value };
    }

    onReset   = () => this.setState({ preview : this.props.value });
    onPreview = (preview) => this.setState({ preview });
    onStar    = (value) => this.props.onChange(value);

    render() {
        const { preview } = this.state;

        return (
            <div className="user-rater" style={{ direction : "rtl" }}>
                <div onMouseLeave={ this.onReset } className="rater">
                    {
                        STARS.map(star => (
                            <Star
                                id={ star }
                                key={ star }
                                value={ preview }
                                onHover={ this.onPreview }
                                onClick={ this.onStar }
                                readOnly={ this.props.readOnly }
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Rating;