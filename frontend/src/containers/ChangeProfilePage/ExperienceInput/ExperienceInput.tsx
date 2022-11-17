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
  dateStart: string;
  dateEnd: string; //REMEMBER: endDate may be empty string
};

export enum ExperienceType {
  EDUCATION = "직업",
  JOB = "교육",
}
interface Props {
  type: ExperienceType;
  title: string;
  experienceName: string;
  onAddBubble: (bubble: ExperienceBubble) => void;
  bubbles: Array<ExperienceBubble>;
  onDeleteBubble: ({
    name,
    dateStart,
    dateEnd,
    role,
  }: ExperienceBubble) => void;
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
  const [bubbleInfo, setBubbleInfo] = useState<ExperienceBubble>({
    name: "",
    role: "",
    // REMEMBER: dateStart and dateEnd are in format "YYYY-MM-DD"
    // dateEnd may be empty string but not dateStart
    dateStart: "",
    dateEnd: "",
  });

  const onAddBubbleClick = () => {
    if (
      bubbleInfo.name === "" ||
      bubbleInfo.role === "" ||
      bubbleInfo.dateStart === ""
    ) {
      alert.open({ message: "모든 항목을 입력해주세요." });
      return;
    }
    if (new Date(bubbleInfo.dateStart) > new Date(bubbleInfo.dateEnd)) {
      alert.open({ message: "시작일이 종료일보다 늦을 수 없습니다." });
      return;
    }
    onAddBubble(bubbleInfo);
    setBubbleInfo({
      name: "",
      role: "",
      dateStart: "",
      dateEnd: "",
    });
  };

  return (
    <>
      <CreateProfileLabel>
        <FormStyles.BubblesContainer>
          <CreateProfileFormTitle>{title}</CreateProfileFormTitle>
          {bubbles.map((tag, index) => (
            <FormStyles.Bubble key={index}>
              <FormStyles.BubbleCancelButton
                role="cancel"
                onClick={() => {
                  onDeleteBubble(tag);
                }}
              ></FormStyles.BubbleCancelButton>
              <FormStyles.BubbleText>
                {tag.name +
                  " | " +
                  tag.role +
                  " | " +
                  tag.dateStart +
                  " ~ " +
                  tag.dateEnd}
              </FormStyles.BubbleText>
            </FormStyles.Bubble>
          ))}
        </FormStyles.BubblesContainer>
      </CreateProfileLabel>
      <CreateProfileLabel>
        <FormStyles.LabelText>{experienceName}</FormStyles.LabelText>
        <FormStyles.InputContainer>
          <FormStyles.Input
            value={bubbleInfo.name}
            onChange={e => {
              setBubbleInfo({ ...bubbleInfo, name: e.target.value });
            }}
          />
          <FormStyles.InputModifyButton
            type="button"
            onClick={onAddBubbleClick}
          >
            추가
          </FormStyles.InputModifyButton>
        </FormStyles.InputContainer>
      </CreateProfileLabel>
      <CreateProfileLabel style={{ margin: "10px 0" }}>
        <FormStyles.LabelText>
          {type === ExperienceType.EDUCATION ? "전공" : "역할"}
        </FormStyles.LabelText>
        <FormStyles.InputContainer>
          <FormStyles.Input
            value={bubbleInfo.role}
            onChange={e => {
              setBubbleInfo({ ...bubbleInfo, role: e.target.value });
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
            value={bubbleInfo.dateStart}
            onChange={e => {
              setBubbleInfo({ ...bubbleInfo, dateStart: e.target.value });
            }}
          />
        </FormStyles.InputContainer>
        <FormStyles.InputContainer style={{ width: "48%" }}>
          <FormStyles.Input
            type="date"
            role="endDate"
            value={bubbleInfo.dateEnd}
            onChange={e => {
              setBubbleInfo({ ...bubbleInfo, dateEnd: e.target.value });
            }}
          />
        </FormStyles.InputContainer>
      </CreateProfileLabel>
    </>
  );
};

export default ExperienceInput;
