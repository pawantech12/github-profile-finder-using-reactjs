import { FaCodeBranch, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
const RepositoryList = ({ repos, user }) => {
  console.log("repos", repos);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id} className="border-b py-3 flex flex-col gap-2">
            <Link
              to={`/repos/${user.login}/${repo.name}`}
              state={{ repo }}
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {repo.name}
            </Link>
            <p className="text-sm text-gray-500">{repo.description}</p>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1">
                  <FaStar className=" text-yellow-500 w-4 h-4" />{" "}
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <FaCodeBranch className=" text-purple-500 w-4 h-4" />{" "}
                  {repo.forks_count}
                </span>
              </div>
              <span className="bg-gray-200 text-xs text-neutral-800 px-2 py-1 rounded">
                {repo.language}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

RepositoryList.propTypes = {
  repos: propTypes.array.isRequired,
  user: propTypes.shape({
    login: propTypes.string.isRequired,
  }).isRequired,
};

export default RepositoryList;
