import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="bg-white shadow-custom-blue rounded-lg p-6">
      <div className="flex items-center">
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
        <div className="flex gap-5 items-center bg-custom-light rounded-lg p-3 px-6 border mx-auto w-[70%] justify-between mt-5">
          <span className="flex flex-col gap-1 text-base text-slate-500 font-medium items-center">
            Followers
            <span className="text-xl font-semibold text-neutral-800">
              {" "}
              {user.followers}
            </span>
          </span>
          <span className="flex flex-col gap-1 text-base text-slate-500 font-medium items-center">
            Following
            <span className="text-xl font-semibold text-neutral-800">
              {" "}
              {user.following}
            </span>
          </span>
          <span className="flex flex-col gap-1 text-base text-slate-500 font-medium items-center">
            Repositories
            <span className="text-xl font-semibold text-neutral-800">
              {user.public_repos}{" "}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
