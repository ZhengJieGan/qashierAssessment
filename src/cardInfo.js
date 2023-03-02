import { Card, CardBody, Text, Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const CardInfo = (props) => {
  const { high, low, type, fetching } = props;

  return (
    <Card width="auto" height="auto">
      {high.carpark === undefined || low.carpark === undefined || fetching ? (
        <CardBody>
          <Flex justify="center">
            <Spinner />
          </Flex>
        </CardBody>
      ) : (
        <CardBody>
          <Text as="b" fontSize="25px">
            {type}
          </Text>
          <Flex direction="column">
            <Text>HIGHEST ({high?.available} lots available)</Text>
            <Text>{high?.carpark}</Text>
          </Flex>
          <Flex direction="column">
            <Text>LOWEST ({low?.available} lots available)</Text>
            <Text>{low?.carpark}</Text>
          </Flex>
        </CardBody>
      )}
    </Card>
  );
};

export default CardInfo;
