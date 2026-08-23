import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Save,
  Loader2,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import { profileAPI } from "../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    created_at: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileAPI.get();

      setProfile({
        name: data.name || "",
        email: data.email || "",
        created_at: data.created_at,
      });

    } catch (error) {
      console.error("Failed to load profile:", error);
      showToast(
        error.response?.data?.detail ||
          "Failed to load profile.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      showToast("Please enter your name/email.", "error");
      return;
    }

    setSaving(true);

    try {
      const data = await profileAPI.update({
        name: profile.name,
        email: profile.email,
      });

      setProfile((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
      }));
      showToast(
        "Profile updated successfully.",
        "success"
      );

    } catch (error) {
      console.error("Failed to update profile:", error);

      showToast(
        error.response?.data?.detail ||
          "Failed to update profile.",
        "error"
      );

    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F6F8]">
        <Loader2 className="w-6 h-6 animate-spin text-[#E5BA73]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      <Sidebar />
      <main className="flex-1 p-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1
              className="text-[26px] font-medium text-[#0B1B33]"
              style={{
                fontFamily: "var(--font-display)"
              }}
            >
              My Profile
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your personal information.
            </p>
          </div>

        </div>


        {/* Profile Card */}
        <div className="max-w-2xl">

          <form
            onSubmit={handleSave}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
          >

            {/* Avatar */}
            <div className="flex flex-col items-center pb-8 border-b border-slate-100">

              <div className="w-20 h-20 rounded-full bg-[#0B1B33] text-white flex items-center justify-center text-xl font-semibold">
                {initials}
              </div>

              <h2 className="text-lg font-semibold text-[#0B1B33] mt-4">
                {profile.name || "Your Profile"}
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                {profile.email}
              </p>

            </div>


            {/* Personal Information */}
            <div className="mt-8">

              <h3 className="text-base font-semibold text-[#0B1B33] mb-6">
                Personal Information
              </h3>


              {/* Name */}
              <div className="mb-5">

                <label className="block text-sm font-medium text-[#0B1B33] mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-[#0B1B33] outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
                  />

                </div>

              </div>


              {/* Email */}
              <div>

                <label className="block text-sm font-medium text-[#0B1B33] mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-[#0B1B33] outline-none focus:border-[#0B1B33] focus:ring-1 focus:ring-[#0B1B33]/10 transition-all"
                  />

                </div>

              </div>

            </div>


            {/* Account Information */}
            <div className="mt-8 pt-6 border-t border-slate-100">

              <div className="flex items-center gap-3">

                <Calendar className="w-4 h-4 text-[#E5BA73]" />

                <div>
                  <p className="text-xs text-slate-400">
                    Member since
                  </p>

                  <p className="text-sm font-medium text-[#0B1B33]">
                    {profile.created_at
                      ? new Date(
                          profile.created_at
                        ).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Unknown"}
                  </p>
                </div>

              </div>

            </div>


            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">

              <button
                type="submit"
                disabled={
                  saving ||
                  !profile.name.trim() ||
                  !profile.email.trim()
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0B1B33] text-white rounded-xl text-sm font-medium hover:bg-[#162a4a] disabled:opacity-50 transition-all"
              >

                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}