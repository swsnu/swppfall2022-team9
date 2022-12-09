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
import { editMyProfile, getProfile, uploadImage } from "store/slices/profile";
import { useNavigate } from "react-router-dom";
import useAlert from "hooks/useAlert";
import Select from "react-select";
import { CommonGreyColor, ThemeColor } from "styles/common.styles";
import { getAllSkillTags } from "store/slices/skillTags";

type SelectOption = {
  value: string;
  label: string;
};

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
  const [imageFile, setImageFile] = useFileUpload();

  // profile state
  const [profile, setProfile] = useState<Profile>({
    introduction: "",
    skillTags: [],
    educations: [],
    jobExperiences: [],
    website: "",
    imgUrl: "",
  });
  const [selectedSkillOption, setSelectedSkillOption] =
    useState<SelectOption | null>(null);
  const [selectableSkills, setSelectableSkills] = useState<Array<SelectOption>>(
    [],
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const currentUser = useAppSelector(state => state.users.currentUser);

  // DESC: this is for getting already stored profile data in server
  const getCurrentUserProfile = async () => {
    try {
      const response = await dispatch(getProfile(currentUser!.id)).unwrap();
      setProfile(response);
    } catch (err) {
      // the user
      console.log(err);
      alert.open({
        message: "오류가 발생했습니다.",
        buttons: [
          {
            label: "홈페이지로 돌아가기",
            onClick: () => {
              alert.close();
              navigate("/");
            },
          },
        ],
      });
    }
  };

  const getSelectableSkillTags = async () => {
    try {
      const data = await dispatch(getAllSkillTags()).unwrap();
      const skillTags: Array<SelectOption> = data.skillTags.map(tag => ({
        value: tag.name,
        label: tag.name,
      }));
      setSelectableSkills(skillTags);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getCurrentUserProfile();
      getSelectableSkillTags();
    }
  }, [currentUser]);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(editMyProfile(profile)).unwrap();
      if (imageFile) {
        alert.open({
          message: "처리 중입니다...",
          buttons: [],
        });
        await dispatch(uploadImage(imageFile as FileUpload)).unwrap();
        alert.close();
      }
      if (currentUser) {
        // DESC: we navigate to personal profile page after creation of profile
        navigate(`/profile/${currentUser.id}`);
        window.location.reload();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const onAddSkillTag = (tagToAdd: SelectOption | null) => {
    if (
      tagToAdd &&
      !profile.skillTags.find(tag => tag.name === tagToAdd.value)
    ) {
      setProfile(prev => ({
        ...prev,
        skillTags: [...prev.skillTags, { name: tagToAdd.value }],
      }));
      setSelectedSkillOption(null);
    }
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

  const setImageFileCallBack = (file: FileUpload | [FileUpload]) => {
    const singleFile = file as FileUpload;
    // TODO: upload to cloudinary (we need REST API for uploading file)
    const imageFileToUpload = singleFile.file;
    // WARNING: this is just for demo purpose, we should send image to server
    // and then set this image url
    const imgUrl = URL.createObjectURL(imageFileToUpload);
    setProfile(prev => ({ ...prev, imgUrl }));
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
                setImageFile(
                  { accept: "image/*", multiple: false },
                  setImageFileCallBack,
                );
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
            <Select
              styles={{
                option: (_, state) => ({
                  backgroundColor: state.isSelected
                    ? ThemeColor
                    : state.isFocused
                    ? CommonGreyColor
                    : "transparent",
                  color: "black",
                  padding: 10,
                }),

                input: provided => ({
                  ...provided,
                  width: "100%",
                  borer: "none",
                  ":focus": {
                    border: "none",
                  },
                  ":active": {
                    border: "none",
                  },
                }),
                container: provided => ({
                  ...provided,
                  width: "100%",
                  outline: "none",
                  ":focus": {
                    border: "none",
                  },
                  ":active": {
                    border: "none",
                  },
                }),
                control: () => ({
                  display: "flex",
                  borderColor: CommonGreyColor,
                  border: `1px solid #8b8b8b`,
                }),
                menu: provided => ({
                  ...provided,
                  boxShadow: "none",
                  border: "1px solid #8b8b8b",
                }),
              }}
              defaultValue={selectedSkillOption}
              value={selectedSkillOption}
              onChange={setSelectedSkillOption}
              options={selectableSkills}
              placeholder="키워드를 선택해주세요"
              isSearchable
              isClearable
            />
            <FormStyles.InputModifyButton
              type="button"
              onClick={() => {
                onAddSkillTag(selectedSkillOption);
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
