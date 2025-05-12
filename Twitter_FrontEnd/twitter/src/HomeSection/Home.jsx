import { Navigation } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import RightPart from "./RightPart";
const LazyTweetSection = lazy(() => import("../components/Tweet/TweetSection"));
const LazyUserProfile = lazy(() => import("./UserProfile"));
const LazyTweetPage = lazy(() => import("../components/Tweet/TweetPage"));
const LazyReplyTweetPage = lazy(() =>
  import("../components/Reply/ReplyTweetPage")
);
const LazyProfile = lazy(() => import("./Profile"));
function Home() {
  const isUserLoggedIn = sessionStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    try {
      if (!isUserLoggedIn) navigate("/");
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <Grid container className="px-4 1g:px-36 justify-between" xs={12}>
      <Grid item xs={6} lg={2.5} className="hidden lg:block w-full relative">
        <Navigation />
      </Grid>
      <Grid Item xs={12} lg={6} className={`px-5 1g:px-9 border`}>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyTweetSection />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyProfile />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyUserProfile />
              </Suspense>
            }
          />
          <Route
            path="/tweetPage"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyTweetPage />
              </Suspense>
            }
          />
          <Route
            path="/replyTweetPage/:tweetId/:userId"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyReplyTweetPage />
              </Suspense>
            }
          />
        </Routes>
      </Grid>
      <Grid item xs={0} lg={3.5} className="hidden lg:block">
        <RightPart />
      </Grid>
    </Grid>
  );
}
export default Home;
