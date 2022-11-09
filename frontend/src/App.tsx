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

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
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
          <Route
            path="*"
            element={
              <AuthWrapper>
                <h1>Not Found</h1>
              </AuthWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
