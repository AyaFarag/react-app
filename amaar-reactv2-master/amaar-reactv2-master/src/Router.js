import React, { Component } from "react";
import { Route, Switch }    from "react-router-dom";
import { hot }              from "react-hot-loader";
import queryString          from "query-string";

import Header from "./routes/Shared/Header";
import Footer from "./routes/Shared/Footer";

import Index          from "./routes/Index";
import Search         from "./routes/Search";
import Login          from "./routes/Login";
import Company        from "./routes/Company";
import CompanyProject from "./routes/CompanyProject";
import Activate       from "./routes/Activate";
import About          from "./routes/About";
import Forget         from "./routes/Forget";
import Privacy        from "./routes/Privacy";
import Contact        from "./routes/Contact";
import Partners       from "./routes/Partners";
import Gallery        from "./routes/Gallery";
import Consultation   from "./routes/Consultation";
import Logout         from "./routes/Logout";

import RegisterRouter from "./routes/Register/Router";
import ProfileRouter  from "./routes/Profile/Router";

import UserContext     from "./contexts/user";
import SettingsContext from "./contexts/settings";

import ScrollToTop from "./components/ScrollToTop";
import Loading     from "./components/Loading";

import axios        from "./api/axios";
import { SETTINGS } from "./api/urls";

import { FIREBASE_CONFIG, FCM_PUBLIC_VAPID_KEY } from "./config";

firebase.initializeApp(FIREBASE_CONFIG);


try {
    window.fcmInstance = firebase.messaging();

    window.fcmInstance.usePublicVapidKey(FCM_PUBLIC_VAPID_KEY);
} catch (e) {
    window.fcmInstance = null;
    console.log(e);
}

class Router extends Component {
    state = {
        user     : null,
        settings : null,
        offline  : false
    };

    componentWillMount() {
        axios.interceptors.response.use(resp => resp, (error) => {
            if (error?.response && error?.response.status === 401 && error?.response?.data?.message === "Unauthenticated.") {
                this.clearLoginData();
                this.props.history.push(`/login`);
            }
            return Promise.reject(error);
        });

        this.fetchSettings().catch(() => this.setState({ offline : true }));
        if (window.fcmInstance)
            this.setupFcm();

        const token = window.localStorage.getItem("token");
        const user = window.localStorage.getItem("user");
        if (token && user) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            this.setState({ user : JSON.parse(user) });
        }
    }

    async fetchSettings() {
        const { data : { data : settings } } = await axios({ ...SETTINGS() });

        this.setState({ settings });
    }

    setupFcm() {

        navigator.serviceWorker.register("/sw.js")
            .then(sw => window.fcmInstance.useServiceWorker(sw))
            .catch(console.log);
        window.fcmInstance.onMessage((payload) => {
            console.log("Received notification through webpage's script", payload.data);
            var notificationTitle = payload.data.title;
            var notificationOptions = {
                body         : "",
                icon         : "/images/logo.png"
            };

            switch (payload.data.title) {
                case "account-activated":
                    this.updateUserData({ ...this.state.user, status : true });
                    notificationTitle = "تم تفعيل الحساب بنجاح";
                    notificationOptions.body = "لقد تم تفعيل حسابك بنجاح, يمكنك الآن رؤية معلومات الشركات.";
                    break;
                case "subscription-approved":
                    notificationTitle = "لقد تم قبول إشتراكك";
                    notificationOptions.body = "سوف يتم إظهار شركتك في نتائج البحث";
                    break;
            }

            new Notification(notificationTitle, notificationOptions);
        });
    }

    clearLoginData() {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        this.setState({ user : null });
    }

    logout = () => {
        this.clearLoginData();
        this.props.history.push("/");
    };

    updateUserData = (user) => {
        this.setState({ user });
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        window.localStorage.setItem("token", user.token);
        window.localStorage.setItem("user", JSON.stringify(user));
    };

    render() {
        const { settings, offline } = this.state;

        if (!settings) {
            return (
                <div
                    className="overlay"
                    style={{
                        position       : "absolute",
                        top            : 0,
                        left           : 0,
                        width          : "100%",
                        height         : "100vh",
                        display        : "flex",
                        flexDirection  : "column",
                        justifyContent : "center",
                        alignItems     : "center"
                    }}
                >
                    <img src="/images/logo.png" />
                    <Loading />
                    {
                        offline &&
                            <div class="mt-2">من فضلك تأكد من اتصالك بالانترنت</div>
                    }
                </div>
            );
        }

        return (
            <SettingsContext.Provider value={{ settings }}>
                <UserContext.Provider
                    value={{
                        updateUserData : this.updateUserData,
                        logout         : this.logout,
                        user           : this.state.user,
                        isLoggedIn     : !!this.state.user
                    }}
                >
                    <Header />
                    <ScrollToTop />
                    <Switch>
                        <Route exact path="/" component={ Index } />
                        <Route exact path="/activate" component={ Activate } />
                        <Route exact path="/search" component={ Search } />
                        <Route exact path="/login" component={ Login } />
                        <Route exact path="/logout" component={ Logout } />
                        <Route exact path="/about" component={ About } />
                        <Route exact path="/privacy" component={ Privacy } />
                        <Route exact path="/contact" component={ Contact } />
                        <Route exact path="/gallery" component={ Gallery } />
                        <Route exact path="/partners" component={ Partners } />
                        <Route exact path="/consultation" component={ Consultation } />
                        <Route exact path="/forget" component={ Forget } />
                        <Route path="/register" component={ RegisterRouter } />
                        <Route path="/profile" component={ ProfileRouter } />
                        <Route exact path="/company/:id" component={ Company } />
                        <Route exact path="/company/:id/project/:project" component={ CompanyProject } />
                    </Switch>
                    <Footer />
                </UserContext.Provider>
            </SettingsContext.Provider>
        );
    }
}

export default hot(module)(Router);