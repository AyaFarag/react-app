import React from "react";


function Section({ label, className = "", children }, ref) {
    return (
        <section className={ className } ref={ ref }>
            <div className="row m-0 align-items-center w90 mx-auto" style={{ overflow : "hidden" }}>
                <div className="col-12 search-head my-4">
                    <h2 className="w-100 text-right m-0 p-0 font-weight-bold">{ label }</h2>
                </div>
            </div>
            { children }
        </section>
    );
}

export default React.forwardRef(Section);