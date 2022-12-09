import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "containers/HomePage/HomePage";
import Navbar from "components/Navbar/Navbar";
import SignUpPage from "containers/SignUpPage/SignUpPage";
import VerifyRegisterPage from "containers/VerifyRegisterPage/VerifyRegisterPage";
import AuthWrapper from "containers/AuthWrapper/AuthWrapper";
import ForgotAccountPage from "containers/ForgotAccountPage/ForgotAccountPage";
import AccountPage from "containers/AccountPage/AccountPage";
import axios from "axios";
import ChangePasswordPage from "containers/ChangePasswordPage/ChangePasswordPage";
import AuthenticatedChangePasswordPage from "containers/AuthenticatedChangePasswordPage/AuthenticatedChangePasswordPage";
import EvaluateQualityPage from "containers/EvaluateQualityPage/EvaluateQualityPage";
import ChangeProfilePage from "containers/ChangeProfilePage/ChangeProfilePage";
import ProfilePage from "containers/ProfilePage/ProfilePage";
import { useEffect } from "react";
import { useAppDispatch } from "store/hooks";
import { getSessionCookie } from "store/slices/users";
import ChatRoomListPage from "containers/ChatRoomListPage/ChatRoomListPage";
import ChatRoomPage from "containers/ChatRoomPage/ChatRoomPage";
import { NotificationContextProvider } from "containers/Context/NotificationContext/NotificationContext";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const App = () => {
  // DESC: For now I have implemented login session get request
  // in App.tsx. It may be better to move this to AuthWrapper later
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getSessionCookie());
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <NotificationContextProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <AuthWrapper>
                  <HomePage />
                </AuthWrapper>
              }
            />
            <Route path="/profile/change" element={<ChangeProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/evaluate/:userId" element={<EvaluateQualityPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/account">
              <Route index={true} element={<AccountPage />} />
              <Route path="forgot" element={<ForgotAccountPage />} />
              <Route
                path="password"
                element={<AuthenticatedChangePasswordPage />}
              />
              <Route path="password/:token" element={<ChangePasswordPage />} />
            </Route>
            <Route path="/verify/:token" element={<VerifyRegisterPage />} />
            <Route path="/chat/" element={<ChatRoomListPage />} />
            <Route path="/chat/:chatRoomName/" element={<ChatRoomPage />} />
            <Route
              path="*"
              element={
                <AuthWrapper>
                  <h1>Not Found</h1>
                </AuthWrapper>
              }
            />
          </Routes>
        </NotificationContextProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
