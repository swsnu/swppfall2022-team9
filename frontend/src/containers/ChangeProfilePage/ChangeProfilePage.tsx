import { useEffect, useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import { FileUpload, useFileUpload } from "use-file-upload";
import { Profile } from "server/models/profile.model";
import styled from "styled-components";
import ExperienceInput, {
  ExperienceBubble,
  ExperienceType,
} from "./ExperienceInput/ExperienceInput";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getProfile, postCreateProfile } from "store/slices/profile";
import { useNavigate } from "react-router-dom";

export const CreateProfileFormTitle = styled.div`
  display: flex;
  padding: 5px 10px;
  padding-left: 0;
  font-weight: bold;
`;

export const CreateProfileLabel = styled(FormStyles.Label)`
  margin-bottom: 15px;
`;

// DESC: This pages is going to be use for both creation and modification
const ChangeProfilePage: React.FC = () => {
  // reference: https://github.com/Marvinified/use-file-upload
  // This part might be tricky when creating test code
  // you could mock useFileUpload hook just as we mock useDispatch
  const [, setImageFile] = useFileUpload();

  // profile state
  const [profile, setProfile] = useState<Profile>({
    introduction: "",
    skillTags: [],
    educations: [],
    jobExperiences: [],
    website: "",
    imgUrl:
      "https://www.smlounge.co.kr/upload/woman/article/202112/thumb/49686-473794-sampleM.jpg",
  });
  const [skillInput, setSkillInput] = useState<string>("");

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const currentUser = useAppSelector(state => state.users.currentUser);

  // DESC: this is for getting already stored profile data in server
  const getCurrentUserProfile = async () => {
    try {
      const response = await dispatch(getProfile(currentUser!.id)).unwrap();
      setProfile(response);
    } catch (err) {
      // the user
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrentUserProfile();
  }, []);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(postCreateProfile(profile)).unwrap();
      if (currentUser) {
        // DESC: we navigate to personal profile page after creation of profile
        navigate(`/profile/${currentUser.id}`);
      }
    } catch (err) {
      console.log(err);
    }
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

  const onAddEducation = (bubble: ExperienceBubble) => {
    setProfile(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          school: bubble.name,
          dateStart: bubble.dateStart,
          dateEnd: bubble.dateEnd,
          major: bubble.role,
        },
      ],
    }));
  };

  const onDeleteEducation = (bubble: ExperienceBubble) => {
    setProfile(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => {
        return !(
          edu.school === bubble.name &&
          edu.dateStart === bubble.dateStart &&
          edu.dateEnd === bubble.dateEnd &&
          edu.major === bubble.role
        );
      }),
    }));
  };

  const onAddJob = (bubble: ExperienceBubble) => {
    setProfile(prev => ({
      ...prev,
      jobExperiences: [
        ...prev.jobExperiences,
        {
          company: bubble.name,
          dateStart: bubble.dateStart,
          dateEnd: bubble.dateEnd,
          position: bubble.role,
        },
      ],
    }));
  };

  const onDeleteJob = (bubble: ExperienceBubble) => {
    setProfile(prev => ({
      ...prev,
      jobExperiences: prev.jobExperiences.filter(job => {
        return !(
          job.company === bubble.name &&
          job.dateStart === bubble.dateStart &&
          job.dateEnd === bubble.dateEnd &&
          job.position === bubble.role
        );
      }),
    }));
  };

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
                    role="cancel"
                  />
                  <FormStyles.BubbleText>{tag.name}</FormStyles.BubbleText>
                </FormStyles.Bubble>
              ))}
            </FormStyles.BubblesContainer>
          </CreateProfileLabel>
          <FormStyles.ExtraContainer
            style={{
              alignSelf: "flex-start",
              marginTop: -30,
              fontSize: 12,
              marginBottom: -25,
            }}
          >
            나를 대표하는 키워드를 설정해주세요
          </FormStyles.ExtraContainer>

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
            type={ExperienceType.EDUCATION}
            title="교육 이력"
            experienceName="학교 이름"
            onAddBubble={onAddEducation}
            bubbles={profile.educations.map(edu => {
              return {
                name: edu.school,
                dateStart: edu.dateStart,
                dateEnd: edu.dateEnd,
                role: edu.major,
              };
            })}
            onDeleteBubble={onDeleteEducation}
          />
          <FormStyles.DivisionLine></FormStyles.DivisionLine>
          <ExperienceInput
            type={ExperienceType.JOB}
            title="직업 경험"
            experienceName="기관 이름"
            onAddBubble={onAddJob}
            bubbles={profile.jobExperiences.map(job => {
              return {
                name: job.company,
                dateStart: job.dateStart,
                dateEnd: job.dateEnd,
                role: job.position,
              };
            })}
            onDeleteBubble={onDeleteJob}
          />
          <FormStyles.DivisionLine></FormStyles.DivisionLine>
          <CreateProfileLabel>
            <CreateProfileFormTitle>웹사이트</CreateProfileFormTitle>
          </CreateProfileLabel>
          <FormStyles.Label>
            <FormStyles.InputContainer>
              <FormStyles.Input
                role="website"
                onChange={e => {
                  setProfile(prev => ({ ...prev, website: e.target.value }));
                }}
              />
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <CreateProfileLabel>
            <CreateProfileFormTitle>소개</CreateProfileFormTitle>
          </CreateProfileLabel>
          <FormStyles.Label>
            <FormStyles.TextArea
              role="introduction"
              onChange={e => {
                setProfile(prev => ({ ...prev, introduction: e.target.value }));
              }}
            />
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
