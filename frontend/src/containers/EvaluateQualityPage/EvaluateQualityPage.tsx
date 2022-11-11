import React, { useEffect, useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import Select from "react-select";
import { CommonGreyColor, ThemeColor } from "styles/common.styles";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";

interface Props {}

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const EvaluateQualityPage: React.FC<Props> = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const [qualities, setQualities] = useState<
    Array<{
      value: string;
      label: string;
    }>
  >(options);

  useEffect(() => {
    if (userId) {
      //call get profile to check user name
      // dispatch()
    }
  }, [userId]);

  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const onAddQuality = () => {
    setSelectedOption(null);
  };
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
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
              {qualities.map(quality => (
                <FormStyles.Bubble key={quality.label}>
                  <FormStyles.BubbleLabel>
                    {quality.label}
                  </FormStyles.BubbleLabel>
                  <FormStyles.BubbleCancelButton
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
                options={options}
                placeholder="키워드를 선택해주세요"
                isSearchable
                isClearable
              />
              <FormStyles.InputModifyButton
                type="button"
                onClick={onAddQuality}
              >
                추가
              </FormStyles.InputModifyButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default EvaluateQualityPage;
