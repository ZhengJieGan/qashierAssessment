import axios from "axios";


const API = axios.create({
    baseURL: "https://api.data.gov.sg/v1",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

export const fetchData = () =>
  API.get(
    "/transport/carpark-availability?date_time=2022-01-01T10%3A00%3A00"
  );
