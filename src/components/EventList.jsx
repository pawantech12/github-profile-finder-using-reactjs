import { formatDistanceToNow } from "date-fns";
import React from "react";
import {
  FaCodeBranch,
  FaCodeCommit,
  FaCodePullRequest,
  FaEye,
  FaStar,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const EventList = ({ receivedEvents, userAvatar }) => {
  // Destructuring event properties
  const { type, created_at, repo, actor, payload } = receivedEvents;

  // Format time
  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });
  // Handle different event types
  switch (type) {
    case "PushEvent":
      return (
        <li className="border-b py-5">
          <div className="flex items-center gap-5">
            <div className="relative w-fit">
              <img
                src={actor.avatar_url}
                alt="user profile"
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 -right-2 bg-slate-100 rounded-full p-1 border border-gray-200">
                <FaCodeCommit className=" text-green-500 w-3 h-3" />
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                <Link
                  href={`https://github.com/${actor.login}`}
                  className="font-bold text-blue-500"
                >
                  {actor.login}
                </Link>{" "}
                pushed {payload.size} commit(s) to your repository
              </span>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="ms-10 mt-5 flex items-center gap-2">
            <ul className="ml-8 mt-2">
              {payload.commits.map((commit, index) => (
                <li key={index}>
                  <a
                    href={commit.url}
                    className="text-sm text-gray-600 flex gap-2"
                  >
                    - {commit.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    case "ForkEvent":
      return (
        <li className="border-b py-5">
          <div className="flex items-center gap-5">
            <div className="relative w-fit">
              <img
                src={actor.avatar_url}
                alt="user profile"
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 -right-2 bg-slate-100 rounded-full p-1 border border-gray-200">
                <FaCodeBranch className=" text-purple-500 w-3 h-3" />
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                <Link
                  href={`https://github.com/${actor.login}`}
                  className="font-bold text-blue-500"
                >
                  {actor.login}
                </Link>{" "}
                forked your repository
              </span>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="ms-10 mt-5 flex items-center gap-2">
            <figure>
              <img
                src={actor.avatar_url}
                alt=" avatar"
                className="w-8 rounded-full"
              />
            </figure>
            <Link
              href={`https://github.com/${payload.forkee.full_name}`}
              className="text-blue-500"
            >
              {payload.forkee.full_name}
            </Link>
          </div>
        </li>
      );
    case "WatchEvent":
      return (
        <li className="border-b py-5">
          <div className="flex items-center gap-5">
            <div className="relative w-fit">
              <img
                src={actor.avatar_url}
                alt="user profile"
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 -right-2 bg-slate-100 rounded-full p-1 border border-gray-200">
                <FaStar className=" text-yellow-500 w-3 h-3" />
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                <Link
                  href={`https://github.com/${actor.login}`}
                  className="font-bold text-blue-500"
                >
                  {actor.login}
                </Link>{" "}
                starred your repository
              </span>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="ms-10 mt-5 flex items-center gap-2">
            <figure>
              <img
                src={userAvatar}
                alt="user avatar"
                className="w-8 rounded-full"
              />
            </figure>
            <Link
              href={`https://github.com/${repo.name}`}
              className="text-blue-500"
            >
              {repo.name}
            </Link>
          </div>
        </li>
      );
    case "PullRequestEvent":
      return (
        <li className="border-b py-5">
          <div className="flex items-center gap-5">
            <div className="relative w-fit">
              <img
                src={actor.avatar_url}
                alt="user profile"
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 -right-2 bg-slate-100 rounded-full p-1 border border-gray-200">
                <FaCodePullRequest className=" text-emerald-500 w-3 h-3" />
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                <Link
                  href={`https://github.com/${actor.login}`}
                  className="font-bold text-blue-500"
                >
                  {actor.login}
                </Link>{" "}
                opened a pull request on
              </span>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="ms-10 mt-5 flex items-center gap-2">
            <figure>
              <img
                src={userAvatar}
                alt="user avatar"
                className="w-8 rounded-full"
              />
            </figure>
            <Link
              href={`https://github.com/${repo.name}`}
              className="text-blue-500"
            >
              {repo.name}
            </Link>
          </div>
        </li>
      );
    default:
      return (
        <li className="border-b py-5">
          <div className="flex items-center gap-5">
            <div className="relative w-fit">
              <img
                src={actor.avatar_url}
                alt="user profile"
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute bottom-0 -right-2 bg-slate-100 rounded-full p-1 border border-gray-200">
                <FaEye className=" text-neutral-500 w-3 h-3" />
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                <Link
                  href={`https://github.com/${actor.login}`}
                  className="font-bold text-blue-500"
                >
                  {actor.login}
                </Link>{" "}
                did something on
              </span>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="ms-10 mt-5 flex items-center gap-2">
            <figure>
              <img
                src={userAvatar}
                alt="user avatar"
                className="w-8 rounded-full"
              />
            </figure>
            <Link
              href={`https://github.com/${repo.name}`}
              className="text-blue-500"
            >
              {repo.name}
            </Link>
          </div>
        </li>
      );
  }
};

export default EventList;
