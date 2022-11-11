import React, { useEffect, useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import Select from "react-select";
import { CommonGreyColor, ThemeColor } from "styles/common.styles";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import {
  getAllQualityTags,
  getUserQualityTags,
  putUserQualityTags,
} from "store/slices/qualityTags";

interface Props {}

type SelectOption = {
  value: string;
  label: string;
};

// WARNING: This is stub data! If backend has implemented, remove this!
const options = [
  { value: "Sincere", label: "Sincere" },
  { value: "Honest", label: "Honest" },
  { value: "Understanding", label: "Understanding" },
  { value: "Loyal", label: "Loyal" },
  { value: "Truthful", label: "Truthful" },
  { value: "Dependable", label: "Dependable" },
];

const EvaluateQualityPage: React.FC<Props> = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  // REMEMBER: remove the below line if navigate is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [selectableQualities, setSelectableQualities] =
    useState<Array<SelectOption>>(options);
  const [assignedQualities, setAssignedQualities] = useState<
    Array<SelectOption>
  >([]);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

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
      // TODO: When error happens the user should be redirected to the main page
      // For now, the navigate is turned off for test purposes,
      // If backend is well prepared please uncomment the below line
      // navigate("/");
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) {
      getSelectableQualityTags();
      // REMEMBER: When error happens the user should be redirected to the main page
      getQualityTagsCurrentUserHasAssignedToUser(Number(userId));
    }
  }, [userId]);

  const onAddQuality = (qualityToAdd: SelectOption | null) => {
    if (qualityToAdd && !assignedQualities.includes(qualityToAdd)) {
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
  };

  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>
            동료로서 차동주님은 어떤가요?
          </FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            차동주님에게 어울리는 키워드를 몇 개 골라주세요
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.BubblesContainer>
              {assignedQualities.map(quality => (
                <FormStyles.Bubble key={quality.label}>
                  <FormStyles.BubbleLabel>
                    {quality.label}
                  </FormStyles.BubbleLabel>
                  <FormStyles.BubbleCancelButton
                    onClick={() => {
                      onDeleteQuality(quality.label);
                    }}
                    role="close-icon"
                    aria-label="close-icon"
                    color="black"
                    size={20}
                  />
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
