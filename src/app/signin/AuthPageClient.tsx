"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPageClient() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setIsLogin(false);
    if (mode === 'login') setIsLogin(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        alert("注册成功，请查收邮箱激活账号！");
        setIsLogin(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? '登录账号' : '注册账号'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          {isLogin ? '登录' : '注册'}
        </button>
      </form>
      <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded mt-4">
        使用 Google 登录
      </button>
      <div className="mt-4 text-center">
        {isLogin ? (
          <span>没有账号？ <button className="text-blue-600 hover:underline" onClick={() => setIsLogin(false)}>注册</button></span>
        ) : (
          <span>已有账号？ <button className="text-blue-600 hover:underline" onClick={() => setIsLogin(true)}>登录</button></span>
        )}
      </div>
    </div>
  );
} 