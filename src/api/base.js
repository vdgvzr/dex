import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_PAPRIKA_URL;

export const baseApi = axios.create({});
