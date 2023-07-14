import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const token = sessionStorage.getItem("token")
  ? JSON.parse(sessionStorage.getItem("token")).tokens?.access?.token
  : null;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] =
        "Bearer " +
        JSON.parse(sessionStorage.getItem("token")).tokens.access.token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;
    if (error.response.status == 401 && !prevRequest._retry) {
      prevRequest._retry = true;

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: BASE_URL + "/auth/refresh-tokens",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          refreshToken: JSON.parse(sessionStorage.getItem("token")).tokens
            .refresh.token,
        }),
      };

      //refresh token
      const refresh = await axios.request(config);
      console.log("retry", refresh);
      //set new token
      const currentToken = JSON.parse(sessionStorage.getItem("token"));
      currentToken.tokens = refresh.data;
      sessionStorage.setItem("token", JSON.stringify(currentToken));
      prevRequest.headers["Authorization"] =
        "Bearer " + refresh.data.access.token;
      return instance(prevRequest);
    }
    return Promise.reject(error);
  }
);

export default instance;
