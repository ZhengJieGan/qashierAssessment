import { filter, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { fetchData } from "./api";

function App() {
  const [data, setData] = useState([]);

  async function getData() {
    try {
      const { data } = await fetchData();
      setData(data.items[0].carpark_data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const dummyData = [
    {
      carpark_info: [
        {
          total_lots: "105",
          lot_type: "C",
          lots_available: "0",
        },
      ],
      carpark_number: "HE12",
      update_datetime: "2022-01-01T07:00:57",
    },
    {
      carpark_info: [
        {
          total_lots: "50",
          lot_type: "C",
          lots_available: "100",
        },
        {
          total_lots: "400",
          lot_type: "C",
          lots_available: "0",
        },
      ],
      carpark_number: "HE15",
      update_datetime: "2022-01-01T07:00:57",
    },
    {
      carpark_info: [
        {
          total_lots: "200",
          lot_type: "C",
          lots_available: "0",
        },
        {
          total_lots: "100",
          lot_type: "C",
          lots_available: "0",
        },
      ],
      carpark_number: "HE22",
      update_datetime: "2022-01-01T07:00:57",
    },
  ];

  const filteredData = dummyData.filter((item) => {
    // extract the total_lots value for each carpark_info object and sum them up
    const carparkInfo = item.carpark_info[0];

    const totalLots = parseInt(carparkInfo.total_lots);
    // console.log(totalLots);
    // check if the sum is within the range of 100 to 300
    return totalLots >= 100 && totalLots <= 300;
  });

  let highestAvailableLotObj = null;
  let lowestAvailableLotObj = null;

  filteredData.forEach((item) => {
    item.carpark_info.forEach((info) => {
      const lotsAvailable = parseInt(info.lots_available);

      if (
        highestAvailableLotObj === null ||
        lotsAvailable >
          parseInt(highestAvailableLotObj.carpark_info[0].lots_available)
      ) {
        highestAvailableLotObj = item;
      }

      if (
        lowestAvailableLotObj === null ||
        lotsAvailable <
          parseInt(lowestAvailableLotObj.carpark_info[0].lots_available)
      ) {
        lowestAvailableLotObj = item;
      }
    });
  });

  console.log(highestAvailableLotObj)
  console.log(lowestAvailableLotObj)

  return <Flex>running</Flex>;
}

export default App;

// to check what is the highest number of lots_available
// const maxLotsAvailable = filteredData.reduce(
//   (max, item) => {
//     const carparkInfo = item.carpark_info[0];
//     const lotsAvailable = parseInt(carparkInfo.lots_available);
//     return lotsAvailable > max.lotsAvailable ? { item, lotsAvailable } : max;
//   },
//   { item: null, lotsAvailable: -Infinity }
// );

// console.log(maxLotsAvailable.item);

// useEffect(() => {
//   filteredData.map((item) => {
//     if (parseInt(item.carpark_info[0].lots_available) === 0) {
//       console.log(item);
//     }
//   });
// }, [filteredData]);
// console.log(zerosAvailable);
