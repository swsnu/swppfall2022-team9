import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "containers/HomePage/HomePage";
import Navbar from "components/Navbar/Navbar";
import SignUpPage from "containers/SignUpPage/SignUpPage";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              // we have to wrap it with auth wrapper after implementing auth
              // <AuthWrapper>
              <HomePage />
              // </AuthWrapper>
            }
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
