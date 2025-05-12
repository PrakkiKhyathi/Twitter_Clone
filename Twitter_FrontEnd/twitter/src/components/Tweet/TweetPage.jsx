import { useSelector } from "react-redux";
import TweetPageCard from "./TweetPageCard";

function TweetPage() {
  const state = useSelector((state) => state.TweetReducer.tweets);
  const tweets = state.tweets;
  const userIdsProfileData = state.userIdsProfileData;
  let filteredTweets = tweets;
  let filterUserProfile = userIdsProfileData;
  const [filteredTweetsState, setFilteredTweetsState] = useState(tweets);
  const [filteredUserProfileState, setFilteredProfileState] =
    useState(userIdsProfileData);
  const [openCalender, setOpenCalender] = useState(false);
  function handleDatePicker() {
    setOpenCalender((open) => !open);
  }
  async function handleDateChange(e) {
    if (e.target.value === "") {
      filteredTweets = tweets;
      filterUserProfile = userIdsProfileData;
      setFilteredTweetsState(tweets);
      setFilteredProfileState(userIdsProfileData);
      return;
    }
    filteredTweets = tweets.filter((ele) => {
      console.log(ele);

      return ele.updatedAt.substring(0, 18) == e.target.value;
    });
    filterUserProfile = [];
    filteredTweets.forEach((ele) => {
      let userProfile = userIdsProfileData.find(
        (profile) => profile.userId == ele.userId
      );

      filterUserProfile.push(userProfile);
    });
    setFilteredProfileState(filterUserProfile);
    setFilteredTweetsState(filteredTweets);
  }
  if (filterUserProfile.length !== filteredTweets.length) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-item-center">
        <h4>Tweets</h4>
        <label className="flex align-items-center gap-2 rounded-md cursor-pointer">
          <DateRangeIcon className="text-primary" onClick={handleDatePicker} />
          {openCalender && <input type="date" onChange={handleDateChange} />}
        </label>
      </div>
      {filteredTweetsState.length > 0 ? (
        filteredTweetsState.map((tweetItem, index) => (
          <TweetPageCard
            tweetItem={tweetItem}
            profileData={filteredUserProfileState[index]}
          />
        ))
      ) : (
        <div className="text-center text-dark">No Tweets Found</div>
      )}
    </div>
  );
}
export default TweetPage;
