import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
const LazyAuthentication = lazy(() =>
  import("./components/Authentication/Authentication")
);

const LazyRegistrationForm = lazy(() =>
  import("./components/Authentication/RegistrationForm")
);

const LazyLoginForm = lazy(() =>
  import("./components/Authentication/LoginForm")
);

const LazyResetPassword = lazy(() =>
  import("./components/Authentication/Forgot Password")
);

const LazyHome = lazy(() => import("./HomeSection/Home"));
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyAuthentication />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyRegistrationForm />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyLoginForm />
              </Suspense>
            }
          />
          <Route
            path="/home/*"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyHome />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
