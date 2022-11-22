import { render, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { profileStub, profileStub2 } from "server/stubs/profiles.stub";
import { Profile } from "server/models/profile.model";
import NetworkAnalysis from "./NetworkAnalysis";
import { usersStub } from "server/stubs/users.stub";
import { OneChonInfo } from "types/friend.types";
import { User } from "server/models/users.model";

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
