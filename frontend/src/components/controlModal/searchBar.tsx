import { InputGroup, Input, Button } from "react-daisyui";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { currentDestinationState } from "../../utils/atoms";
import { routingEndpoint, vehicleId } from "../../utils/constants";
import { routeData } from "../../utils/types";

function SearchBar() {
  const [search, setSearch] = useState<string>("");
  const setDestination = useSetRecoilState(currentDestinationState);

  return (
    <InputGroup className="w-full">
      <Input
        placeholder="Search…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Button
        className="btn-primary"
        onClick={() => {
          const options = {
            method: "GET",
          };

          const params = {
            vehicleId: vehicleId,
            destination: search,
          };

          fetch(routingEndpoint + "?" + new URLSearchParams(params), options)
            .then((response) => response.json())
            .then((response: any) => {
              setDestination(response.routes);
            })
            .catch((err) => console.log(err));
        }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
  );
}

export default SearchBar;
