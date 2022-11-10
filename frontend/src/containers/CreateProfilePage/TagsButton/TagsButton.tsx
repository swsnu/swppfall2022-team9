import * as SProfile from "../styles";
import { Profile, SkillTag } from "server/models/profile.model";
interface Props {
  skillTag: SkillTag;
  setUpdatedProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const TagsButton: React.FC<Props> = ({ skillTag, setUpdatedProfile }) => {
  const onClickTagsContainer = () => {
    {
      setUpdatedProfile(prevProfile => {
        const tempProfile = { ...prevProfile };
        tempProfile.skillTags = tempProfile.skillTags.filter(
          item => item.name !== skillTag.name,
        );
        return tempProfile;
      });
    }
  };
  return (
    <SProfile.SkillTagsDiv>
      <SProfile.SkillTagsButton onClick={onClickTagsContainer}>
        {skillTag.name}
      </SProfile.SkillTagsButton>
    </SProfile.SkillTagsDiv>
  );
};

export default TagsButton;
