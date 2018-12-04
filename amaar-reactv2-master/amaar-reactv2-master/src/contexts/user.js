import React from "react";

export default React.createContext({
    updateUserData : () => true,
    logout         : () => true,
    user           : null,
    isLoggedIn     : false
});