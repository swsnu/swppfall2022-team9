import * as SProfile from "./styles";
import { Profile, ProfileKey } from "server/models/profile.model";
interface Props {
  tagName: string;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  propsName: string;
}

const TagsButton: React.FC<Props> = ({ tagName, setProfile, propsName }) => {
  const onClickTagsContainer = () => {
    setProfile(prevProfile => {
      const tempProfile = { ...prevProfile };
      tempProfile[propsName as ProfileKey] = tempProfile[
        propsName as ProfileKey
      ].filter(item => item !== tagName);
      return tempProfile;
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
