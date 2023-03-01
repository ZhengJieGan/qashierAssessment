import { Text, SimpleGrid, Flex } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
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
  const klDateObject = new Date(date);
  const klIsoString = klDateObject.toISOString();
  const formattedDate = encodeURIComponent(klIsoString).slice(0, -5);

  useMemo(() => {
    async function getData() {
      try {
        setFetching(true);

        setLastUpdated(date);
        const response = await fetchData(formattedDate);
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
    }, 6000);

    return () => clearInterval(intervalId);
  }, [date, formattedDate]);

  // To find the highest and lowest lots available
  const DataFiltering = (data, start, end) => {
    const filteredData = data.filter((item) => {
      let carparkInfo = 0;

      // if carpark_info has more than one object
      if (item.carpark_info.length > 1) {
        item.carpark_info.forEach((item) => {
          carparkInfo += parseInt(item.total_lots);
        });
      } else {
        carparkInfo = parseInt(item.carpark_info[0].total_lots);
      }

      // check if the sum is within the range of 100 to 300
      return carparkInfo >= start && carparkInfo <= end;
    });

    let highest = null;
    let lowest = null;

    // find the carpark that has the highest and lowest lots available
    filteredData.forEach((item) => {
      item.carpark_info.forEach((info) => {
        const lotsAvailable = parseInt(info.lots_available);

        if (
          highest === null ||
          lotsAvailable > parseInt(highest.carpark_info[0].lots_available)
        ) {
          highest = item;
        }

        if (
          lowest === null ||
          lotsAvailable < parseInt(lowest.carpark_info[0].lots_available)
        ) {
          lowest = item;
        }
      });
    });
    return { highest, lowest };
  };

  // Restructure the data for easier props passing
  const DataRestructure = (data) => {
    let totalAvailable = 0;
    if (data?.carpark_info?.length > 1) {
      data?.carpark_info.forEach((item) => {
        totalAvailable += parseInt(item.lots_available);
      });
    } else {
      totalAvailable = parseInt(data?.carpark_info[0]?.lots_available);
    }
    return { carpark: data?.carpark_number, available: totalAvailable };
  };

  const smallData = DataFiltering(data, 0, 100);
  const smallHigh = DataRestructure(smallData?.highest);
  const smallLow = DataRestructure(smallData?.lowest);

  const mediumData = DataFiltering(data, 100, 300);
  const mediumHigh = DataRestructure(mediumData?.highest);
  const mediumLow = DataRestructure(mediumData?.lowest);

  const bigData = DataFiltering(data, 300, 400);
  const bigHigh = DataRestructure(bigData?.highest);
  const bigLow = DataRestructure(bigData?.lowest);

  const largeData = DataFiltering(data, 400, Infinity);
  const largeHigh = DataRestructure(largeData?.highest);
  const largeLow = DataRestructure(largeData?.lowest);

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
        <CardInfo
          high={smallHigh}
          low={smallLow}
          type="Small"
          fetching={fetching}
        />
        <CardInfo
          high={mediumHigh}
          low={mediumLow}
          type="Medium"
          fetching={fetching}
        />
        <CardInfo high={bigHigh} low={bigLow} type="Big" fetching={fetching} />
        <CardInfo
          high={largeHigh}
          low={largeLow}
          type="Large"
          fetching={fetching}
        />
      </SimpleGrid>
    </Flex>
  );
}

export default App;
