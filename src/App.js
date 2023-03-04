import { Text, SimpleGrid, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { fetchData } from "./api";
import CardInfo from "./cardInfo";

function App() {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const dateObject = new Date();
  const date = dateObject.toLocaleString("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
  });

  useEffect(() => {
    async function getData() {
      try {
        setFetching(true);
        setLastUpdated(date);
        const response = await fetchData();

        if (response.status === 200) {
          const { carpark_data } = response.data.items[0];
          setData(carpark_data);
          setFetching(false);
        } else {
          setFetching(true);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getData();

    const intervalId = setInterval(() => {
      getData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [date]);

  // To find the highest and lowest lots available
  const DataFiltering = (data, start, end) => {
    const filteredData = data.filter((item) => {
      let carparkInfo = 0;

      // if carpark_info has more than one object
      if (item.carpark_info.length > 1) {
        item.carpark_info.forEach((item) => {
          carparkInfo += parseInt(item.total_lots);
        });
        // if carpark_info has only has one object
      } else {
        carparkInfo = parseInt(item.carpark_info[0].total_lots);
      }

      // check if the sum is within the range of 100 to 300
      return carparkInfo > start && carparkInfo < end;
    });

    let highest = [];
    let lowest = [];

    // find the carpark that has the highest and lowest lots available
    filteredData.forEach((item) => {
      let totalLotsAvailable = 0;

      // loop through the carpark info because it might have more than one object
      item.carpark_info.forEach((info) => {
        const lotsAvailable = parseInt(info.lots_available);
        totalLotsAvailable += lotsAvailable;

        item = {
          ...item,
          lots_available: totalLotsAvailable,
        };
      });

      // if the carpark info has more than one object, replace the lots_available to totalLotsAvailable
      // in this case, there will always be only one object inside carpark_info
      if (
        highest.length === 0 ||
        item?.lots_available > highest[0].lots_available
      ) {
        highest[0] = item;
      }

      // find the lowest carpark_info first
      if (
        lowest.length === 0 ||
        item?.lots_available < lowest[0].lots_available
      ) {
        lowest[0] = item;
      }

      // look for objects that has the same number of lots_available
      // if equal then push the object
      if (
        item?.lots_available === lowest[0].lots_available &&
        lowest.length !== 3 &&
        item !== lowest[0]
      ) {
        lowest.push(item);
      }
    });

    return { highest, lowest };
  };

  const small = DataFiltering(data, 0, 100);
  const medium = DataFiltering(data, 100, 300);
  const big = DataFiltering(data, 300, 400);
  const large = DataFiltering(data, 400, Infinity);

  return (
    <Flex direction="column" justify="center">
      <Flex width="100%" justify="center" marginTop="100px">
        <Text as="i">Last update at: {lastUpdated}</Text>
      </Flex>

      <SimpleGrid
        minChildWidth="500px"
        spacing="40px"
        justifyContent="center"
        alignItems="center"
        padding="5%"
      >
        <CardInfo data={small} type="Small" fetching={fetching} />
        <CardInfo data={medium} type="Medium" fetching={fetching} />
        <CardInfo data={big} type="Big" fetching={fetching} />
        <CardInfo data={large} type="Large" fetching={fetching} />
      </SimpleGrid>
    </Flex>
  );
}

export default App;
