import axios from "axios";

const http = axios.create({
  baseURL: "https://snow.jigpud.com",
});

export default http;
