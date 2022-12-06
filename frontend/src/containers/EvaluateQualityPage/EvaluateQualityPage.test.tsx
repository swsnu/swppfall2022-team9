import { renderWithProviders } from "test-utils/mocks";
import EvaluateQualityPage from "./EvaluateQualityPage";
import { MemoryRouter, Route, Routes, Navigate } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const renderEvaluateQualityPage = () => {
  return renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/:userId" element={<EvaluateQualityPage />} />
        <Route path="*" element={<Navigate to="/1" />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {},
    },
  );
};

describe("<EvaluateQualityPage/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders EvaluateQualityPage", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderEvaluateQualityPage();
  });

  it("tests dispatch", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({
        qualityTags: [{ name: "tag" }, { name: "tag2" }],
      }),
    });
    renderEvaluateQualityPage();
  });

  // it("tests add and submit button and delete", async () => {
  //   mockDispatch
  //     .mockReturnValueOnce({
  //       unwrap: () => ({}),
  //     })
  //     .mockReturnValueOnce({
  //       unwrap: () => ({ qualityTags: [{ name: "tag" }, { name: "tag2" }] }),
  //     });
  //   renderEvaluateQualityPage();
  //   const input = screen.getByRole("combobox");
  //   fireEvent.change(input, { target: { value: "성실한" } });
  //   const select = screen.getByText("성실한");
  //   fireEvent.click(select);

  //   const button = screen.getAllByRole("button");
  //   fireEvent.click(button[0]);

  //   const close = await waitFor(() => screen.getAllByRole("close-icon")[0]);
  //   fireEvent.click(close);

  //   const submit = screen.getByText("제출");
  //   await waitFor(() => fireEvent.click(submit));
  // });

  it("tests no-userId", async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => ({}),
    });
    renderWithProviders(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<EvaluateQualityPage />} />
        </Routes>
      </MemoryRouter>,
    );
  });

  // it("tests duplicate tag", async () => {
  //   mockDispatch.mockReturnValue({
  //     unwrap: () => ({}),
  //   });
  //   renderEvaluateQualityPage();
  //   const input = screen.getByRole("combobox");
  //   fireEvent.change(input, { target: { value: "성실한" } });
  //   const select = screen.getByText("성실한");
  //   fireEvent.click(select);

  //   const button = screen.getAllByRole("button");
  //   fireEvent.click(button[0]);

  //   fireEvent.change(input, { target: { value: "성실한" } });
  //   const select2 = screen.getAllByText("성실한")[1];
  //   fireEvent.click(select2);
  //   fireEvent.click(button[0]);
  // });

  // it("tests onFocus", async () => {
  //   mockDispatch.mockReturnValue({
  //     unwrap: () => ({}),
  //   });
  //   renderEvaluateQualityPage();
  //   const input = screen.getByRole("combobox");
  //   fireEvent.change(input, { target: { value: "정" } });
  //   userEvent.hover(screen.getByText("정직한"));
  //   fireEvent.click(screen.getByText("정직한"));
  //   await waitFor(() => screen.getByText("정직한"));
  //   // this renders honest option
  //   fireEvent.change(input, { target: { value: "정" } });
  // });
});
