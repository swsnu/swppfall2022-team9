import * as SProfile from "../styles";
import SearchBar from "../SearchBar/SearchBar";
interface Props {
  removeBackDrop: () => void;
  propsName: string;
  setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const BackDrop: React.FC<Props> = ({
  removeBackDrop,
  propsName,
  setShowSearchBar,
  setInput,
}) => {
  return (
    <SProfile.Div>
      <SProfile.BackDrop role="backdrop" onClick={removeBackDrop} />
      <SearchBar
        propsName={propsName}
        setShowSearchBar={setShowSearchBar}
        setInput={setInput}
      />
    </SProfile.Div>
  );
};
export default BackDrop;
