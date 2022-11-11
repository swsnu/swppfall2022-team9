import { useState } from "react";
import * as FormStyles from "styles/common.form.styles";
import { FileUpload, useFileUpload } from "use-file-upload";
import { SkillTag } from "server/models/profile.model";

const CreateProfilePage = () => {
  // reference: https://github.com/Marvinified/use-file-upload
  const [, setImageFile] = useFileUpload();
  const [myTags, setMyTags] = useState<Array<SkillTag>>([]);
  const [inputTag, setInputTag] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    "https://www.smlounge.co.kr/upload/woman/article/202112/thumb/49686-473794-sampleM.jpg",
  );
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  const onAddTag = (tagValue: string) => {
    setMyTags(prev => [...prev, { name: tagValue }]);
    setInputTag("");
  };
  const onDeleteTag = (tagValue: string) => {
    setMyTags(prev => prev.filter(tag => tag.name !== tagValue));
  };
  return (
    <FormStyles.Container>
      <FormStyles.FormContainer>
        <FormStyles.Header>
          <FormStyles.HeaderText>프로필</FormStyles.HeaderText>
        </FormStyles.Header>
        <FormStyles.Form onSubmit={onSubmit}>
          <FormStyles.Label>
            <FormStyles.Image imgUrl={profileImageUrl} />
            <FormStyles.InputModifyButton
              type="button"
              style={{ marginLeft: 15, padding: "10px 15px" }}
              onClick={e => {
                e.preventDefault();
                setImageFile({ accept: "image/*", multiple: false }, file => {
                  const singleFile = file as FileUpload;
                  // TODO upload to cloudinary (we need REST API for uploading file)
                  const imageFileToUpload = singleFile.file;
                  // WARNING: this is just for demo purpose, we should send image to server
                  // and then set this image url
                  const imageUrl = URL.createObjectURL(imageFileToUpload);
                  setProfileImageUrl(imageUrl);
                });
              }}
            >
              이미지 업로드
            </FormStyles.InputModifyButton>
          </FormStyles.Label>
          <FormStyles.Label>
            <FormStyles.BubblesContainer>
              <div
                style={{
                  display: "flex",
                  padding: "5px 10px",
                  fontWeight: "bold",
                }}
              >
                나의 태그들
              </div>
              {myTags.map((tag, index) => (
                <FormStyles.Bubble key={index}>
                  {tag.name}
                  <FormStyles.BubbleCancelButton
                    onClick={() => {
                      onDeleteTag(tag.name);
                    }}
                  />
                </FormStyles.Bubble>
              ))}
            </FormStyles.BubblesContainer>
          </FormStyles.Label>

          <FormStyles.InputContainer>
            <FormStyles.Input
              value={inputTag}
              onChange={e => {
                e.preventDefault();
                setInputTag(e.target.value);
              }}
            />
            <FormStyles.InputModifyButton
              type="button"
              onClick={() => {
                onAddTag(inputTag);
              }}
            >
              추가
            </FormStyles.InputModifyButton>
          </FormStyles.InputContainer>

          <FormStyles.DivisionLine></FormStyles.DivisionLine>
          <FormStyles.Label>
            <FormStyles.BubblesContainer>
              <div
                style={{
                  display: "flex",
                  padding: "5px 10px",
                  fontWeight: "bold",
                }}
              >
                교육 이력
              </div>
              {myTags.map((tag, index) => (
                <FormStyles.Bubble key={index}>
                  {tag.name}
                  <FormStyles.BubbleCancelButton
                    onClick={() => {
                      onDeleteTag(tag.name);
                    }}
                  />
                </FormStyles.Bubble>
              ))}
            </FormStyles.BubblesContainer>
          </FormStyles.Label>
        </FormStyles.Form>
      </FormStyles.FormContainer>
    </FormStyles.Container>
  );
};

export default CreateProfilePage;
