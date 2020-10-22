import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => async (dispatch) => {
  // this is redux thunk in use, see lecture 85 for recap
  const res = await axios.get("/api/current_user");

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post("/api/stripe", token);

  // we are dispatching the same type as the above request which gets us the user,
  // but this time it's with their updated number of credits
  dispatch({ type: FETCH_USER, payload: res.data });
};
