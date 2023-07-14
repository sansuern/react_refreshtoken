import React, { useRef } from "react";
import "./index.css";
import useRefreshtoken from "./useRefreshtoken";
import useAxiosPrivate from "./useAxiosPrivate";
export default function App() {
  const form = useRef(null);
  const refresh = useRefreshtoken();
  const axiosPrivate = useAxiosPrivate();

  const sesstion = JSON.parse(sessionStorage.getItem("token"));

  const access_token = sesstion?.tokens?.access?.token;
  const refresh_token = sesstion?.tokens?.refresh?.token;
  const id = sesstion?.user?.id;
  const company = sesstion?.user?.company_user_map[0]?.company.id;
  const store = sesstion?.user?.company_user_map[0]?.company.store[0]?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const thisForm = form.current;

    let data = JSON.stringify({
      username: thisForm.user.value,
      password: thisForm.password.value,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/api/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const resonse = await axios.request(config);
    sessionStorage.setItem("token", JSON.stringify(resonse.data));
    console.log(resonse);
  };

  const QueryData = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/api/products?search=&tag=&sortBy=id&sortType=desc&limit=10&page=0",
      headers: {
        "company-id": company,
        "store-id": store,
        "user-id": id,
        Authorization: "Bearer " + access_token,
      },
    };
    const resonse = await axiosPrivate.request(config);
    console.log(resonse);
  };

  return (
    <div>
      <h1>Login</h1>
      <form ref={form} onSubmit={handleSubmit} action="POST">
        user
        <input name="user" value="ceo"></input>
        password
        <input name="password" value="ceo"></input>
        <button type="submit">Submit</button>
      </form>
      <hr></hr>

      <h1>Query Data</h1>
      <button onClick={() => QueryData()}>Get</button>
      <hr></hr>

      <h1>Refresh Token</h1>
      <button onClick={() => refresh()}>Refresh</button>
      <hr></hr>
    </div>
  );
}
