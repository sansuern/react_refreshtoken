import axiosInstance from "./axios";



function useRefreshtoken() {
    const refresh =  async () => {
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "/auth/refresh-tokens",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
                "refreshToken" : JSON.parse(sessionStorage.getItem('token')).tokens.refresh.token
            })
          };


        const response = await axiosInstance.request(config);
        const currentToken = JSON.parse(sessionStorage.getItem('token'));
        console.log("old",currentToken.tokens)
        console.log("new",response.data)
        currentToken.tokens = response.data
        sessionStorage.setItem('token', JSON.stringify(currentToken));
        return response.data
    }
    return refresh
}

export default useRefreshtoken