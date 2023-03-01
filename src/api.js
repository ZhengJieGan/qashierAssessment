import axios from "axios";

const API = axios.create({
  baseURL: "https://api.data.gov.sg/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const dateObject = new Date();
const date = dateObject.toLocaleString("en-US", {
  timeZone: "Asia/Kuala_Lumpur",
});
const klDateObject = new Date(date);
const klIsoString = klDateObject.toISOString();
const formattedDate = encodeURIComponent(klIsoString).slice(0, -5);

export const fetchData = () =>
  API.get(`/transport/carpark-availability?date_time=${formattedDate}`);
