import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authAxios = axios.create({
  baseURL: "http://localhost:3000/api/",
});

authAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default authAxios;
