import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => {
  // this is redux thunk in use, see lecture 85 for recap
  return function (dispatch) {
    axios
      .get("/api/current_user")
      .then((res) => dispatch({ type: FETCH_USER, payload: res }));
  };
};
