import React, { Fragment } from "react";

import SettingsContext from "../../contexts/settings";
import withContext     from "../../contexts/with-context";

function Footer({ settings }) {
    const { social_network } = settings;

    return (
        <section className="backimg w-100 d-inline-block scrolleffect" id="contact">
            <section className="contact">
                <div className="footer-details">
                    <div className="row m-0 py-3 w90 m-auto text-center">
                        <div className="col-12 h-100 align-self-center align-items-center">
                            <ul className="list-inline text-center align-self-center align-items-center h-100 p-0">
                                {
                                    social_network.facebook && (
                                        <li className="list-inline-item m-0 p-1">
                                            <a target="_blank" href={ social_network.facebook }>
                                                <img src="/images/facebook.png"/>
                                            </a>
                                        </li>
                                    )
                                }
                                {
                                    social_network.twitter && (
                                        <li className="list-inline-item m-0 p-1">
                                            <a target="_blank" href={ social_network.twitter }>
                                                <img src="/images/twitter.png"/>
                                            </a>
                                        </li>
                                    )
                                }
                                {
                                    social_network.instagram && (
                                        <li className="list-inline-item m-0 p-1">
                                            <a target="_blank" href={ social_network.instagram }>
                                                <img src="/images/instagram.png"/>
                                            </a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <div className="col-12 align-self-center align-items-center text-center">
                            <p className="lead contact-information py-1"> المكتب الرئيسي : { settings.address }</p>
                            <p className="lead contact-information">الهاتف : { settings.phone }</p>
                        </div>

                    </div>
                </div>
            </section>

        </section>
    );
}

export default withContext(Footer, SettingsContext);