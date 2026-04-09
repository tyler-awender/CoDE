"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Profile = {
  id: string;
  email: string | null;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
};

type MetricsRow = {
  id: number;
  user_id: string;
  game_type: string;
  score: number;
  games_played: number;
  streak: number;
  created_at: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [totalGames, setTotalGames] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setDisplayName(profileData.display_name || "");

      const { data: metricsData, error: metricsError } = await supabase
        .from("metrics")
        .select("*")
        .eq("user_id", user.id);

      if (!metricsError && metricsData) {
        const rows = metricsData as MetricsRow[];

        setTotalGames(rows.length);

        const maxScore =
          rows.length > 0 ? Math.max(...rows.map((row) => row.score || 0)) : 0;
        setBestScore(maxScore);

        const maxStreak =
          rows.length > 0 ? Math.max(...rows.map((row) => row.streak || 0)) : 0;
        setCurrentStreak(maxStreak);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave() {
    if (!profile) return;

    setSaving(true);

    const { error } = await supabase
      .from("users")
      .update({ display_name: displayName })
      .eq("id", profile.id);

    if (error) {
      alert(error.message);
      console.error(error);
    } else {
      setProfile({ ...profile, display_name: displayName });
      alert("Profile updated successfully!");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h1>Profile</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h1>Profile</h1>
          <p>You must be logged in to view this page.</p>
          <Link href="/auth/login" className="profile-link">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="avatar-circle">
          {profile.display_name?.charAt(0).toUpperCase() || "U"}
        </div>

        <h1>{profile.display_name}</h1>
        <p className="profile-username">@{profile.username}</p>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-date">
          Joined: {new Date(profile.created_at).toLocaleDateString()}
        </p>

        <div className="edit-section">
          <label>Edit Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter new display name"
          />
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <h2>{totalGames}</h2>
          <p>Total Games</p>
        </div>

        <div className="metric-card">
          <h2>{bestScore}</h2>
          <p>Best Score</p>
        </div>

        <div className="metric-card">
          <h2>{currentStreak}</h2>
          <p>Current Streak</p>
        </div>
      </div>
    </main>
  );
}


