import useAlert from "hooks/useAlert";
import React, { useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import {
  CreateProfileLabel,
  CreateProfileFormTitle,
} from "../ChangeProfilePage";

export type ExperienceBubble = {
  name: string;
  role: string; //REMEMBER: role is either position(experience) or major(education)
  startDate: string;
  endDate: string; //REMEMBER: endDate may be empty string
};

interface Props {
  type: "experience" | "education";
  title: string;
  experienceName: string;
  onAddBubble: (bubble: ExperienceBubble) => void;
  bubbles: Array<ExperienceBubble>;
  onDeleteBubble: ({ name, startDate, endDate }: ExperienceBubble) => void;
}
const ExperienceInput: React.FC<Props> = ({
  type,
  experienceName,
  title,
  onAddBubble,
  bubbles,
  onDeleteBubble,
}) => {
  const alert = useAlert();
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const onChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // REMEMBER: startDateInput is string type
    // when cleared, an empty string is returned
    setStartDateInput(e.target.value);
  };
  const onChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // REMEMBER: endDateInput is string type
    // when cleared, an empty string is returned
    setEndDateInput(e.target.value);
  };
  return (
    <>
      <CreateProfileLabel>
        <FormStyles.BubblesContainer>
          <CreateProfileFormTitle>{title}</CreateProfileFormTitle>
          {bubbles.map((tag, index) => (
            <FormStyles.Bubble key={index}>
              {tag.name + " " + tag.startDate + " ~ " + tag.endDate}
              <FormStyles.BubbleCancelButton
                onClick={() => {
                  onDeleteBubble(tag);
                }}
              ></FormStyles.BubbleCancelButton>
            </FormStyles.Bubble>
          ))}
        </FormStyles.BubblesContainer>
      </CreateProfileLabel>
      <CreateProfileLabel>
        <FormStyles.LabelText>{experienceName}</FormStyles.LabelText>
        <FormStyles.InputContainer>
          <FormStyles.Input
            value={institutionName}
            onChange={e => {
              setInstitutionName(e.target.value);
            }}
          />
          <FormStyles.InputModifyButton>추가</FormStyles.InputModifyButton>
        </FormStyles.InputContainer>
      </CreateProfileLabel>
      <CreateProfileLabel style={{ margin: "10px 0" }}>
        <FormStyles.LabelText>
          {type === "education" ? "전공" : "역할"}
        </FormStyles.LabelText>
        <FormStyles.InputContainer>
          <FormStyles.Input
            value={institutionName}
            onChange={e => {
              setInstitutionName(e.target.value);
            }}
          />
        </FormStyles.InputContainer>
      </CreateProfileLabel>
      <CreateProfileLabel
        style={{ marginTop: 25, justifyContent: "space-between" }}
      >
        <FormStyles.InputContainer style={{ width: "48%" }}>
          <FormStyles.LabelText style={{ fontSize: 11 }}>
            시작 날짜
          </FormStyles.LabelText>
        </FormStyles.InputContainer>

        <FormStyles.InputContainer style={{ width: "48%" }}>
          <FormStyles.LabelText style={{ fontSize: 11 }}>
            끝난 날짜
          </FormStyles.LabelText>
        </FormStyles.InputContainer>
      </CreateProfileLabel>
      <CreateProfileLabel style={{ justifyContent: "space-between" }}>
        <FormStyles.InputContainer style={{ width: "48%" }}>
          <FormStyles.Input
            type="date"
            role="startDate"
            value={startDateInput}
            onChange={onChangeStartDate}
          />
        </FormStyles.InputContainer>
        <FormStyles.InputContainer style={{ width: "48%" }}>
          <FormStyles.Input
            type="date"
            role="endDate"
            value={endDateInput}
            onChange={onChangeEndDate}
          />
        </FormStyles.InputContainer>
      </CreateProfileLabel>
    </>
  );
};

export default ExperienceInput;
