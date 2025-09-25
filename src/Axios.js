import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const localhost = Constants.expoConfig.hostUri?.split(":")[0];
const baseURL = `http://${localhost}:3030`;

const api = axios.create({
  baseURL,
  timeout: 5000,
});

// run php -S 0.0.0.0:3003 on GYM001
const admin_api = axios.create({
  baseURL: `http://${localhost}:3003`,
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api, admin_api };
