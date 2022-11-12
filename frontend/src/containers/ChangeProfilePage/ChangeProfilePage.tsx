import { useEffect, useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import { FileUpload, useFileUpload } from "use-file-upload";
import {
  EducationTag,
  ExperienceTag,
  Profile,
  SkillTag,
} from "server/models/profile.model";
import styled from "styled-components";
import ExperienceInput, {
  ExperienceBubble,
} from "./ExperienceInput/ExperienceInput";
import { useAppDispatch } from "store/hooks";
import { getMyProfile } from "store/slices/profile";

export const CreateProfileFormTitle = styled.div`
  display: flex;
  padding: 5px 10px;
  padding-left: 0;
  font-weight: bold;
`;

export const CreateProfileLabel = styled(FormStyles.Label)`
  margin-bottom: 15px;
`;

// This pages is going to be use for both creation and modification
const ChangeProfilePage: React.FC = () => {
  // reference: https://github.com/Marvinified/use-file-upload
  // This part might be tricky when creating test code
  const [, setImageFile] = useFileUpload();

  // profile state
  const [profile, setProfile] = useState<Profile>({
    introduction: "",
    skillTags: [],
    education: [],
    jobExperience: [],
    website: "",
    imgUrl:
      "https://www.smlounge.co.kr/upload/woman/article/202112/thumb/49686-473794-sampleM.jpg",
  });
  const [skillInput, setSkillInput] = useState<string>("");

  const dispatch = useAppDispatch();
  const getCurrentUserProfile = async () => {
    try {
      const response = await dispatch(getMyProfile()).unwrap();
      setProfile(response);
    } catch (err) {
      // the user
      console.log(err);
    }
  };

  useEffect(() => {}, []);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  const onAddSkillTag = (tagValue: string) => {
    setProfile(prev => ({
      ...prev,
      skillTags: [...prev.skillTags, { name: tagValue }],
    }));
    setSkillInput("");
  };
  const onDeleteSkillTag = (tagValue: string) => {
    setProfile(prev => ({
      ...prev,
      skillTags: prev.skillTags.filter(tag => tag.name !== tagValue),
    }));
  };

  const onAddEducation = (bubble: ExperienceBubble) => {};
  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>프로필</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            <FormStyles.Image imgUrl={profile.imgUrl} />
            <FormStyles.InputModifyButton
              type="button"
              style={{ marginLeft: 15, padding: "10px 15px" }}
              onClick={e => {
                e.preventDefault();
                setImageFile({ accept: "image/*", multiple: false }, file => {
                  const singleFile = file as FileUpload;
                  // TODO: upload to cloudinary (we need REST API for uploading file)
                  const imageFileToUpload = singleFile.file;
                  // WARNING: this is just for demo purpose, we should send image to server
                  // and then set this image url
                  const imageUrl = URL.createObjectURL(imageFileToUpload);
                  setProfile(prev => ({ ...prev, imageUrl }));
                });
              }}
            >
              이미지 업로드
            </FormStyles.InputModifyButton>
          </FormStyles.Label>
          <CreateProfileLabel>
            <FormStyles.BubblesContainer>
              <CreateProfileFormTitle>나의 태그들</CreateProfileFormTitle>
              {profile.skillTags.map((tag, index) => (
                <FormStyles.Bubble key={index}>
                  <FormStyles.BubbleCancelButton
                    onClick={() => {
                      onDeleteSkillTag(tag.name);
                    }}
                  />
                  <FormStyles.BubbleText>{tag.name}</FormStyles.BubbleText>
                </FormStyles.Bubble>
              ))}
            </FormStyles.BubblesContainer>
          </CreateProfileLabel>

          <FormStyles.InputContainer>
            <FormStyles.Input
              value={skillInput}
              onChange={e => {
                e.preventDefault();
                setSkillInput(e.target.value);
              }}
            />
            <FormStyles.InputModifyButton
              type="button"
              onClick={() => {
                onAddSkillTag(skillInput);
              }}
            >
              추가
            </FormStyles.InputModifyButton>
          </FormStyles.InputContainer>

          <FormStyles.DivisionLine></FormStyles.DivisionLine>
          <ExperienceInput
            type="education"
            title="교육 이력"
            experienceName="학교 이름"
            onAddBubble={bubble => {
              console.log(bubble);
            }}
            bubbles={[]}
            onDeleteBubble={bubble => {
              console.log(bubble);
            }}
          />
          <FormStyles.DivisionLine></FormStyles.DivisionLine>
          <ExperienceInput
            type="experience"
            title="직업 경험"
            experienceName="기관 이름"
            onAddBubble={bubble => {
              console.log(bubble);
            }}
            bubbles={[]}
            onDeleteBubble={bubble => {
              console.log(bubble);
            }}
          />
          <FormStyles.DivisionLine></FormStyles.DivisionLine>
          <CreateProfileLabel>
            <CreateProfileFormTitle>웹사이트</CreateProfileFormTitle>
          </CreateProfileLabel>
          <FormStyles.Label>
            <FormStyles.InputContainer>
              <FormStyles.Input />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <CreateProfileLabel>
            <CreateProfileFormTitle>소개</CreateProfileFormTitle>
          </CreateProfileLabel>
          <FormStyles.Label>
            <FormStyles.TextArea />
          </FormStyles.Label>

          <FormStyles.Submit style={{ marginBottom: 100 }}>
            프로필 변경
          </FormStyles.Submit>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default ChangeProfilePage;
