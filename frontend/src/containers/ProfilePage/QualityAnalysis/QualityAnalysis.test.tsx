import { render } from "@testing-library/react";
import QualityAnalysis from "./QualityAnalysis";

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
