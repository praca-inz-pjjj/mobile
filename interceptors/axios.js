// import axios from "axios";
// import { API_URL } from "../app/context/AuthContext";
// import * as SecureStore from "expo-secure-store";

// let refresh = false;
// axios.interceptors.response.use(
//   (resp) => resp,
//   async (error) => {
//     console.log(`error`, error);
//     if (error.response.status === 401 && !refresh) {
//       refresh = true;
//       const refresh_token = await SecureStore.getItemAsync("refresh_token");
//       const response = await axios.post(
//         API_URL + "/parent/token/refresh",
//         {
//           refresh: refresh_token,
//         },
//         { headers: { "Content-Type": "application/json" } },
//         { withCredentials: true }
//       );
//       console.log("response", response);
//       if (response.status === 200) {
//         axios.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${response.data["access"]}`;
//         console.log("res_data", response.data);
//         await SecureStore.setItemAsync("token", response.data.access);
//         await SecureStore.setItemAsync("refresh_token", response.data.refresh);
//         return axios(error.config);
//       }
//     }
//     refresh = false;
//     return error;
//   }
// );
