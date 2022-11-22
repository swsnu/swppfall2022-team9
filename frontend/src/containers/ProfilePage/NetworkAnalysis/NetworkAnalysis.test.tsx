import { render } from "@testing-library/react";
import { profileStub, profileStub2 } from "server/stubs/profiles.stub";
import NetworkAnalysis from "./NetworkAnalysis";

describe("<QualityAnalsys/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders QualityAnalsys with undefined quality tags", async () => {
    render(
      <NetworkAnalysis
        profileUserName="hi"
        profileUserFriendProfiles={undefined}
      />,
    );
  });

  it("renders QualityAnalsys with quality tags", async () => {
    render(
      <NetworkAnalysis
        profileUserName="hi"
        profileUserFriendProfiles={[
          {
            ...profileStub,
            name: "hi",
            id: 1,
            profileImgUrl: "https://www.naver.com",
          },
          {
            ...profileStub2,
            name: "hi2",
            id: 2,
            profileImgUrl: "https://www.naver.com",
          },
        ]}
      />,
    );
  });
});
