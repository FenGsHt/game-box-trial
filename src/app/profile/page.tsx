"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/profileApi";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getProfile().then(profile => {
      if (profile) setUsername(profile.username || "");
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const ok = await updateProfile(username);
    setMsg(ok ? "保存成功" : "保存失败");
  };

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">个人信息</h1>
      <div className="mb-4 text-gray-700">当前昵称：{username || '未设置'}</div>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          placeholder="昵称"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          保存
        </button>
      </form>
      {msg && <div className="mt-2 text-green-600">{msg}</div>}
    </div>
  );
} 