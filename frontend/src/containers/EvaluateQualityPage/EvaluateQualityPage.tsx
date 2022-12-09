import React, { useEffect, useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import Select from "react-select";
import { CommonGreyColor, ThemeColor } from "styles/common.styles";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getAllQualityTags,
  getUserQualityTags,
  putUserQualityTags,
} from "store/slices/qualityTags";
import { getFriendList } from "store/slices/users";
import useAlert from "hooks/useAlert";

interface Props {}

type SelectOption = {
  value: string;
  label: string;
};

const EvaluateQualityPage: React.FC<Props> = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [profileUserName, setProfileUserName] = useState<string>("");
  const [selectableQualities, setSelectableQualities] = useState<
    Array<SelectOption>
  >([]);
  const [assignedQualities, setAssignedQualities] = useState<
    Array<SelectOption>
  >([]);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const friendList = useAppSelector(state => state.users.friendList);
  const alert = useAlert();

  const getSelectableQualityTags = async () => {
    try {
      const data = await dispatch(getAllQualityTags()).unwrap();
      const qualityTags: Array<SelectOption> = data.qualityTags.map(tag => ({
        value: tag.name,
        label: tag.name,
      }));
      setSelectableQualities(qualityTags);
    } catch (err) {
      console.log(err);
    }
  };

  // REMEMBER: We get the user quality tags the currentUser has assigned to the other user
  // An error should happen when the currentUser is not in 1chon or 2chon relationship
  const getQualityTagsCurrentUserHasAssignedToUser = async (
    otherUserId: number,
  ) => {
    try {
      const data = await dispatch(getUserQualityTags(otherUserId)).unwrap();
      const qualityTagsAssignedToUser: Array<SelectOption> =
        data.qualityTags.map(tag => ({
          value: tag.name,
          label: tag.name,
        }));
      setAssignedQualities(qualityTagsAssignedToUser);
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (userId) {
      getSelectableQualityTags();
      getQualityTagsCurrentUserHasAssignedToUser(Number(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (friendList.length > 0) {
      if (userId) {
        const viewingOneChon = friendList.find(
          oneChon => oneChon.id === Number(userId),
        );
        if (viewingOneChon) {
          setProfileUserName(
            viewingOneChon.lastname + viewingOneChon.firstname,
          );
        }
      }
    } else {
      dispatch(getFriendList());
    }
  }, [friendList, userId]);

  const onAddQuality = (qualityToAdd: SelectOption | null) => {
    if (
      qualityToAdd &&
      !assignedQualities.find(
        assignedQuality => assignedQuality.value === qualityToAdd.value,
      )
    ) {
      setAssignedQualities(prev => [...prev, qualityToAdd]);
      setSelectedOption(null);
    }
  };

  const onDeleteQuality = (qualityLabel: string) => {
    setAssignedQualities(prev =>
      prev.filter(quality => quality.label !== qualityLabel),
    );
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      putUserQualityTags({
        id: Number(userId),
        qualityTags: assignedQualities.map(tag => ({ name: tag.value })),
      }),
    );
    alert.open({
      message: `평가를 완료하였습니다.`,
      buttons: [
        {
          label: "프로필로 돌아가기",
          onClick: () => {
            alert.close();
            navigate(`/profile/${userId}`);
          },
        },
      ],
    });
  };

  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>
            동료로서 {profileUserName} 님은 어떤가요?
          </FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            {profileUserName} 님에게 어울리는 키워드를 몇 개 골라주세요
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.BubblesContainer>
              {assignedQualities.map(quality => (
                <FormStyles.Bubble key={quality.label}>
                  <FormStyles.BubbleCancelButton
                    onClick={() => {
                      onDeleteQuality(quality.label);
                    }}
                    role="close-icon"
                    aria-label="close-icon"
                    color="black"
                    size={20}
                  />
                  <FormStyles.BubbleText>{quality.label}</FormStyles.BubbleText>
                </FormStyles.Bubble>
              ))}
            </FormStyles.BubblesContainer>
          </FormStyles.Label>
          <FormStyles.Label>
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
                defaultValue={selectedOption}
                value={selectedOption}
                onChange={setSelectedOption}
                options={selectableQualities}
                placeholder="키워드를 선택해주세요"
                isSearchable
                isClearable
              />
              <FormStyles.InputModifyButton
                type="button"
                onClick={() => onAddQuality(selectedOption)}
              >
                추가
              </FormStyles.InputModifyButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
          <FormStyles.Submit onClick={onSubmit}>제출</FormStyles.Submit>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default EvaluateQualityPage;
