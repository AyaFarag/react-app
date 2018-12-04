import React, { Component } from "react";
import PropTypes                from "prop-types";

class Select extends Component {
    static propTypes = {
        onChange       : PropTypes.func.isRequired,
        property       : PropTypes.string.isRequired,
        labelProperty  : PropTypes.string.isRequired,
        valueProperty  : PropTypes.string.isRequired,
        className      : PropTypes.string,
        value          : PropTypes.any,
        placeholder    : PropTypes.string,
        invalidMessage : PropTypes.string,
        isLoading      : PropTypes.bool,
        required       : PropTypes.bool,
        valid          : PropTypes.bool
    };

    static defaultProps = {
        className   : "",
        placeholder : "",
        value       : "",
        isLoading   : false,
        required    : false,
        valid       : true
    };

    state = { firstTime : true };

    componentDidUpdate(props) {
        const { onChange, property, options, valueProperty, placeholder, value } = this.props;
    
        if (options.length) {
            if (value == -1 && !placeholder) {
                onChange(options[0], property, true);
            } else if (props.isLoading !== this.props.isLoading) {
                if (value != -1) {
                    const filtered = options.filter(item => item[valueProperty] == value);console.log(filtered);
                    onChange(filtered.length ? filtered[0] : {}, property, true);
                }
            }
        }
    }

    onChange = ({ target }) => {
        const { valueProperty, options, onChange, property } = this.props;
        const id = target.options[target.selectedIndex].value;
        if (id == -1)
            return onChange({ [valueProperty] : -1 }, property, false);

        onChange(options.filter(item => item[valueProperty] == id)[0], property, true);
    };

    onBlur = (evt) => {
        if (this.state.firstTime) {
            this.setState({ firstTime : false });
            this.onChange(evt);
        }
    };

    render() {
        const {
            className,
            placeholder,
            labelProperty,
            valueProperty,
            options,
            value,
            isLoading,
            valid,
            invalidMessage
        } = this.props;

        const isInvalid = !valid && !this.state.firstTime && !isLoading;

        return (
            <div className={ className }>
                <select
                    className="w-100 p-2 font-weight-bold"
                    value={ value }
                    onChange={ this.onChange }
                    onBlur={ this.onBlur }
                    style={ isInvalid ? { borderColor : "red" } : {} }
                >
                    {
                        (placeholder || isLoading)
                            ? (
                                <option value={ -1 } key={ -1 }>
                                    { isLoading ? "جاري التحميل" : placeholder }
                                </option>
                            ) : null
                    }
                    {
                        options.map(item => (
                            <option
                                key={ item[valueProperty] }
                                value={ item[valueProperty] }
                            >
                                { item[labelProperty] }
                            </option>
                        ))
                    }
                </select>
                { isInvalid && <span style={{ color : "red" }}>{ invalidMessage || "هذا الحقل مطلوب" }</span> }
            </div>
        );
    }
}

export default Select;