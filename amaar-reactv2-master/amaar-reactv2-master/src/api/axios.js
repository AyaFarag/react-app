import Axios from "axios";

import { API_KEY, API_URL } from "../config";

export default Axios.create({
    baseURL : API_URL,
    headers : {
        "x-api-key" : API_KEY
    }
});