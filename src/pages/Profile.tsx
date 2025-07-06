import { Mail, Calendar, Edit } from "lucide-react";

const profile = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  joined: "January 2023",
  bio: "Passionate about helping people find what they've lost. Cat lover. Coffee enthusiast.",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  stats: {
    found: 12,
    lost: 5,
    claimed: 8,
  },
};

const Profile = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-green-100 via-white to-green-50 px-2">
      <div className="bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-6 sm:p-10 md:p-14 w-full max-w-lg md:max-w-2xl flex flex-col items-center gap-8 border border-gray-200 dark:border-gray-800 transition-all">
        <div className="relative">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 border-green-400 shadow-lg object-cover transition-all"
          />
          <button className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow transition">
            <Edit className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            {profile.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 mt-2">
            <Mail className="w-5 h-5" />
            <span className="text-base sm:text-lg">{profile.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-400 mt-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm sm:text-base">
              Joined {profile.joined}
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-200 text-center italic text-base sm:text-lg md:text-xl">
          {profile.bio}
        </p>
        <div className="flex justify-center gap-10 mt-4 w-full">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {profile.stats.found}
            </span>
            <span className="text-sm sm:text-base text-gray-500">Found</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {profile.stats.lost}
            </span>
            <span className="text-sm sm:text-base text-gray-500">Lost</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {profile.stats.claimed}
            </span>
            <span className="text-sm sm:text-base text-gray-500">Claimed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
