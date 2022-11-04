import { render } from "@testing-library/react";
import OneChonListItem from "./ChonListItem";

describe("<OneChonListItem/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders OneChonListItem", async () => {
    render(
      <OneChonListItem
        userId={1}
        firstname="test"
        lastname="test"
        imgUrl="testurl.com"
        twoChonList={null}
        isTwoChon={false}
      />,
    );
  });
});
