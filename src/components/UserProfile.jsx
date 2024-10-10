import ContributionChart from "./ContributionChart"; // Import the new chart component
import PropTypes from "prop-types";

const UserProfile = ({ user, contributions }) => {
  return (
    <div className="bg-white shadow-custom-blue rounded-lg p-6">
      <div className="flex items-center max-[410px]:flex-col max-[410px]:text-center">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="rounded-full w-24 h-24"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-neutral-700">{user.name}</h1>
          <span className="text-blue-400 font-semibold">@{user.login}</span>
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <p className="text-slate-500 font-medium px-3">{user.bio}</p>
        <div className="flex gap-5 items-center bg-custom-light rounded-lg p-3 px-6 border mx-auto justify-between mt-5 max-[518px]:flex-wrap max-[518px]:justify-center">
          <span className="flex flex-col gap-1 text-base text-slate-500 font-medium items-center">
            Followers
            <span className="text-xl max-[518px]:text-lg font-semibold text-neutral-800">
              {" "}
              {user.followers}
            </span>
          </span>
          <span className="flex flex-col gap-1 text-base text-slate-500 font-medium items-center">
            Following
            <span className="text-xl max-[518px]:text-lg font-semibold text-neutral-800">
              {" "}
              {user.following}
            </span>
          </span>
          <span className="flex flex-col gap-1 text-base text-slate-500 font-medium items-center">
            Repositories
            <span className="text-xl max-[518px]:text-lg font-semibold text-neutral-800">
              {user.public_repos}{" "}
            </span>
          </span>
        </div>
      </div>

      {/* Add the ContributionChart below the user details */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-neutral-700">Contributions</h2>

        {/* Wrap the chart in a container with overflow-x: auto */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Adjust min-width as needed */}
            <ContributionChart contributions={contributions} />
          </div>
        </div>
      </div>
    </div>
  );
};
UserProfile.propTypes = {
  user: PropTypes.shape({
    avatar_url: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    name: PropTypes.string,
    bio: PropTypes.string,
    followers: PropTypes.number.isRequired,
    following: PropTypes.number.isRequired,
    public_repos: PropTypes.number.isRequired,
  }).isRequired,
  contributions: PropTypes.array.isRequired, // Adjust the type if needed
};
export default UserProfile;
