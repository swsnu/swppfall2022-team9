import * as SProfile from "../styles";
import SearchBar from "../SearchBar/SearchBar";
interface Props {
  removeBackDrop: () => void;
}

const BackDrop: React.FC<Props> = ({ removeBackDrop }) => {
  return (
    <SProfile.Div>
      <SProfile.BackDrop onClick={removeBackDrop} />
      <SearchBar></SearchBar>
    </SProfile.Div>
  );
};
export default BackDrop;
