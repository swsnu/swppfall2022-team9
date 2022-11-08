import * as SProfile from "./styles";
import { Profile, ProfileKey } from "server/models/profile.model";
interface Props {
  tagName: string;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  propsName: string;
}

// eslint-disable-next-line react/prop-types
const TagsButton: React.FC<Props> = ({ tagName, setProfile, propsName }) => {
  const onClickTagsContainer = () => {
    setProfile(prevProfile => {
      return {
        ...prevProfile,
        propsName: prevProfile[propsName as ProfileKey].filter(
          item => item !== tagName,
        ),
      };
    });
  };
  return (
    <SProfile.SkillTagsDiv>
      <SProfile.SkillTagsButton onClick={onClickTagsContainer}>
        {tagName}
      </SProfile.SkillTagsButton>
    </SProfile.SkillTagsDiv>
  );
};

export default TagsButton;
