import React, { useState } from "react";
import * as S from "./styles";
import * as FormStyles from "styles/common.form.styles";
import Select from "react-select";
import { CommonGreyColor, ThemeColor } from "styles/common.styles";

interface Props {}

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const EvaluateQualityPage: React.FC<Props> = () => {
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>
            동료로서 차동주님은 어떤가요?
          </FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form>
          <FormStyles.Label>
            동주에게 어울리는 키워드를 몇 개 골라주세요
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
                    border: `1px solid #d4d4d4`,
                  }),
                  menu: () => ({
                    boxShadow: "none",
                    border: "1px solid black",
                  }),
                }}
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                placeholder="키워드를 선택해주세요"
                isSearchable
                isClearable
              />
              <FormStyles.InputModifyButton>추가</FormStyles.InputModifyButton>
            </FormStyles.InputContainer>
          </FormStyles.Label>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default EvaluateQualityPage;
