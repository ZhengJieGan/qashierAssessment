import { Card, CardBody, Text, Flex, Spinner } from "@chakra-ui/react";
import React, { Fragment } from "react";

const CardInfo = (props) => {
  const { data, type, fetching } = props;
  const { highest, lowest } = data;

  return (
    <Card width="auto" height="auto">
      {data.highest === undefined || data.lowest === undefined || fetching ? (
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
            <Text>HIGHEST ({highest[0]?.lots_available} lots available)</Text>
            <Text>{highest[0]?.carpark_number}</Text>
          </Flex>
          <Flex direction="column">
            <Text>LOWEST ({lowest[0]?.lots_available} lots available)</Text>
            <Flex direction="row">
              {lowest?.map((data, index) => {
                return (
                  <Fragment key={data?.carpark_number}>
                    {index > 0 && (
                      <Text style={{ display: "inline-block" }}>, </Text>
                    )}
                    <Text display="inline-block">{data?.carpark_number} </Text>
                  </Fragment>
                );
              })}
            </Flex>
          </Flex>
        </CardBody>
      )}
    </Card>
  );
};

export default CardInfo;
