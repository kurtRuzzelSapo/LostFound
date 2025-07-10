import { Mail, Calendar, Edit, Award, Search, CheckCircle } from "lucide-react";

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
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 px-2 py-12">
      {/* Avatar and Edit Button */}
      <div className="relative flex flex-col items-center">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-400 object-cover shadow-lg transition-all"
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-lg transition group"
          aria-label="Edit profile"
        >
          <Edit className="w-5 h-5" />
          <span className="absolute left-1/2 -translate-x-1/2 top-[-2.2rem] opacity-0 group-hover:opacity-100 bg-zinc-800 text-white text-xs rounded px-2 py-1 pointer-events-none transition-all whitespace-nowrap">
            Edit Profile
          </span>
        </button>
      </div>

      {/* Name, Email, Joined */}
      <div className="flex flex-col items-center gap-2 mt-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {profile.name}
        </h2>
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-300">
          <Mail className="w-5 h-5" />
          <span className="text-base md:text-lg">{profile.email}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm md:text-base">Joined {profile.joined}</span>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6 max-w-2xl w-full flex justify-center">
        <p className="text-zinc-600 dark:text-zinc-200 text-center text-base md:text-lg italic px-2">
          {profile.bio}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full max-w-2xl my-8 border-t border-dashed border-zinc-300 dark:border-zinc-700" />

      {/* Stats as horizontal pills */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
        <div className="flex items-center gap-2 bg-green-100 dark:bg-zinc-800 rounded-full px-6 py-3">
          <Award className="w-6 h-6 text-green-500" />
          <span className="text-xl font-bold text-green-700 dark:text-green-400">
            {profile.stats.found}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-300 ml-1">
            Found
          </span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-zinc-800 rounded-full px-6 py-3">
          <Search className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
            {profile.stats.lost}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-300 ml-1">
            Lost
          </span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-zinc-800 rounded-full px-6 py-3">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
            {profile.stats.claimed}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-300 ml-1">
            Claimed
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
