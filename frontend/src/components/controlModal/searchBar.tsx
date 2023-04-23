import { InputGroup, Input, Button } from "react-daisyui";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar() {
  return (
    <InputGroup className="w-full">
      <Input placeholder="Search…" />
      <Button className="btn-primary">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
  );
}

export default SearchBar