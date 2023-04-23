import { InputGroup, Input, Button } from "react-daisyui";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar() {
  return (
    <InputGroup>
      <Input className="w-full" placeholder="Search…" />
      <Button>
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
  );
}

export default SearchBar