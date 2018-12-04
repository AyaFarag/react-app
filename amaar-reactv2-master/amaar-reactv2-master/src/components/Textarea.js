import React, { PureComponent } from "react";
import PropTypes                from "prop-types";

class Textarea extends PureComponent {
    static propTypes = {
        onChange       : PropTypes.func.isRequired,
        property       : PropTypes.string,
        className      : PropTypes.string,
        placeholder    : PropTypes.string,
        value          : PropTypes.string,
        invalidMessage : PropTypes.string,
        regex          : PropTypes.object,
        required       : PropTypes.bool,
        valid          : PropTypes.bool,
        isLoading      : PropTypes.bool
    };

    static defaultProps = {
        className      : "",
        property       : "",
        placeholder    : "",
        invalidMessage : "",
        valid          : true,
        required       : false
    };

    state = { firstTime : true };

    validate(val) {
        if (this.props.regex) return this.props.regex.test(val);

        if (this.props.required)
            return !!val.length;

        return true;
    }

    onBlur = (evt) => {
        if (this.state.firstTime) {
            this.setState({ firstTime : false });
            this.props.onChange(evt, this.props.property, this.validate(this.props.value));
        }
    };

    onChange = (evt) => {
        this.props.onChange(evt, this.props.property, this.validate(evt.target.value));
    };

    render() {
        const {
            className,
            type,
            placeholder,
            value,
            property,
            valid,
            isLoading,
            invalidMessage
        } = this.props;

        const isInvalid = !valid && !this.state.firstTime && !isLoading;

        return (
            <div className={ className }>
                <textarea
                    className="w-100 p-2 font-weight-bold"
                    style={ isInvalid ? { borderColor : "red" } : {} }
                    onChange={ this.onChange }
                    onBlur={ this.onBlur }
                    placeholder={ isLoading ? "جاري التحميل" : placeholder }
                    type={ type }
                    value={ value }
                />
                { isInvalid && <span style={{ color : "red" }}>{ invalidMessage || "هذا الحقل مطلوب" }</span> }
            </div>
        );
    }
}

export default Textarea;