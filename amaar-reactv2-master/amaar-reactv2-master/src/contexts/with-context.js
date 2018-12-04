import React from "react";

export default function withContext(Component, Context) {
    return function WithContextComponent(props) {
        return (
            <Context.Consumer>
                { data => <Component { ...props } {  ...data } /> }
            </Context.Consumer>
        );
    };
};