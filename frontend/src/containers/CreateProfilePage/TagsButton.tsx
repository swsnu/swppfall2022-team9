import * as SProfile from "./styles";
interface Props {
  tagName: string;
}

// eslint-disable-next-line react/prop-types
const TagsButton: React.FC<Props> = ({ tagName }) => {
  return <SProfile.SkillTagsContainer>{tagName}</SProfile.SkillTagsContainer>;
};

export default TagsButton;
