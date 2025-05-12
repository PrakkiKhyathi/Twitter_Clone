const initialState = {
  tweets: { tweets: [], userIdsProfileData: [] },
};
export const TweetReducer = (state, action) => {
  switch (action.type) {
    case "TWEET_DATA":
      return {
        ...state,
        tweets: {
          tweets: action.payload.tweets,
          userIdsProfileData: action.payload.userIdsProfileData,
        },
      };
    default:
      return state;
  }
};
export default TweetReducer;
