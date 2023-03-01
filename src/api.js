import axios from "axios";


const API = axios.create({
    baseURL: "https://api.data.gov.sg/v1",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

export const fetchData = (time) =>
  API.get(
    `/transport/carpark-availability?date_time=${time}`
  );
