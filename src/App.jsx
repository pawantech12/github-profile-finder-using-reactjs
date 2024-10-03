import React, { useState } from "react";
import Search from "./components/Search";
import UserProfile from "./components/UserProfile";
import RepositoryList from "./components/RepositoryList";
import { fetchUserProfile, fetchUserRepos } from "./helper/GithubService";
import EventList from "./components/EventList";

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [activeTab, setActiveTab] = useState("repos");
  const [receivedEvents, setReceivedEvents] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false); // New state
  const [loading, setLoading] = useState(false);

  const handleSearch = async (username) => {
    setSearchAttempted(true); // Mark that a search has been performed
    setLoading(true);
    const userProfile = await fetchUserProfile(username);
    console.log("userProfile", userProfile);

    if (userProfile) {
      setUser(userProfile);
      const eventsResponse = await fetch(userProfile.received_events_url);
      const eventsData = await eventsResponse.json();
      setReceivedEvents(eventsData);
      const userRepos = await fetchUserRepos(username);
      setRepos(userRepos);
    } else {
      setUser(null); // If no user profile is found
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 w-[60%] max-[798px]:w-11/12 max-[450px]:w-full">
      <h1 className="text-3xl font-bold text-center mb-8">
        GitHub Profile Finder
      </h1>
      <Search onSearch={handleSearch} />
      {loading ? ( // Show loader if loading
        <div className="flex justify-center items-center h-64">
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      ) : user ? (
        <>
          <UserProfile user={user} />
          <div className="mt-5">
            {/* Tab Navigation */}
            <div className="flex">
              <button
                className={`w-1/2 rounded-s-md transition-all font-semibold ease-in-out duration-200 text-center py-3 cursor-pointer ${
                  activeTab === "repos"
                    ? "bg-blue-400 text-white "
                    : "bg-gray-200 text-neutral-800 "
                }`}
                onClick={() => setActiveTab("repos")}
              >
                Repositories
              </button>

              <button
                className={`w-1/2 rounded-r-md transition-all ease-in-out duration-200 text-center py-3 cursor-pointer font-semibold ${
                  activeTab === "events"
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200 text-neutral-800"
                }`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </button>
            </div>
            {/* Content Area */}
            <div className="mt-6">
              {activeTab === "repos" ? (
                <div>
                  <RepositoryList repos={repos} user={user} />
                </div>
              ) : (
                <div className="">
                  <h3 className="text-xl font-bold mb-4">
                    Recent GitHub Events
                  </h3>
                  <ul>
                    {receivedEvents.map((event) => (
                      <EventList
                        key={event.id}
                        receivedEvents={event}
                        userAvatar={user.avatar_url}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      ) : searchAttempted ? ( // Conditionally render based on search attempt
        <>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-center">Oops!</span>
            <h1 className="text-5xl font-bold text-center">No User Found</h1>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default App;
