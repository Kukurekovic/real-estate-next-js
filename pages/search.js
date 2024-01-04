import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import { BsFilter } from "react-icons/bs";
import SearchFilters from "@/components/SearchFilters";
import Property from "@/components/Property";
import noresult from "../assets/images/noresult.svg";
import { fetchApi, baseUrl } from "@/utils/fetchApi";

/* 3. Data will arrive through ({ properties }) */
const Search = ({ properties }) => {
  const [searchFilters, setSearchFilters] = useState(false);
  /* router contains the URL */
  const router = useRouter();

  return (
    <Box>
      <Flex
        cursor="pointer"
        bg="gray.100"
        borderBottom="1px"
        borderColor="gray.200"
        p="2"
        fontWeight="black"
        fontSize="lg"
        justifyContent="center"
        alignItems="center"
        /* Toggle previous filters  */
        /* If we are currently filtering something, once we clicked, we want to stop filtering  */
        onClick={() => setSearchFilters((prevFilters) => !prevFilters)}
      >
        <Text>Search Property By Filters</Text>
        <Icon paddingLeft="2" w="7" as={BsFilter} />
      </Flex>
      {searchFilters && <SearchFilters />}
      <Text fontSize="2xl" p="4" fontWeight="bold">
        Properties {router.query.purpose}
      </Text>

      <Flex flexWrap="wrap">
        {/* map over all properties and display Property component for each properties*/}
        {/* 4. will be able to use here and map over it */}

        {properties.map((property) => (
          <Property property={property} key={property.id} />
        ))}
      </Flex>
      {properties.length === 0 && (
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          marginTop="5"
          marginBottom="5"
        >
          <Image alt="no result" src={noresult} />
          <Text fontSize="2xl" marginTop="3">
            No Results Found
          </Text>
        </Flex>
      )}
    </Box>
  );
};

/* Static props*/
/* query is comming through URL*/
/* 1. Filter everything */
export async function getServerSideProps({ query }) {
  // Variables that we want to filter by
  const purpose = query.purpose || "for-rent";
  const rentFrequency = query.rentFrequency || "yearly";
  const minPrice = query.minPrice || "0";
  const maxPrice = query.maxPrice || "1000000";
  const roomsMin = query.roomsMin || "0";
  const bathsMin = query.bathsMin || "0";
  const sort = query.sort || "price-desc";
  const areaMax = query.areaMax || "35000";
  const locationExternalIDs = query.locationExternalIDs || "5002";
  const categoryExternalID = query.categoryExternalID || "4";

  /* taking all properties and passing them one by one to query API request */

  const data = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`
  );

  // Pass to a component
  /* we getting back the data from that and we can send it through props */
  /* 2. Sending data to properties */
  return {
    props: {
      properties: data?.hits,
    },
  };
}

export default Search;
