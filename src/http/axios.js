import axios from "axios";

const http = axios.create({
  baseURL: "https://snow.jigpud.com:8443",
});

export default http;
