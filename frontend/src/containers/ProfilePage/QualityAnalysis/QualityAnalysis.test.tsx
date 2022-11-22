import { render, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "test-utils/mocks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { profileStub } from "server/stubs/profiles.stub";
import { Profile } from "server/models/profile.model";
import QualityAnalysis from "./QualityAnalysis";
import { usersStub } from "server/stubs/users.stub";
import { OneChonInfo } from "types/friend.types";
import { User } from "server/models/users.model";

describe("<QualityAnalsys/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders QualityAnalsys with undefined quality tags", async () => {
    render(<QualityAnalysis profileUserName="hi" qualityTags={undefined} />);
  });

  it("renders QualityAnalsys with quality tags", async () => {
    render(
      <QualityAnalysis
        profileUserName="hi"
        qualityTags={[{ name: "t1" }, { name: "t2" }, { name: "t1" }]}
      />,
    );
  });
});
