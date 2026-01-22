"use client";

import { useEffect, useState } from "react";
import { Category, Condition } from "@/lib/types";
import { getTgUser, tgReady } from "@/lib/tg";

export default function Create() {
  const user = getTgUser();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("MDL");
  const [category, setCategory] = useState<Category>("Other");
  const [condition, setCondition] = useState<Condition>("Used");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { tgReady(); }, []);

  async function submit() {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("price", String(price));
      fd.append("currency", currency);
      fd.append("category", category);
      fd.append("condition", condition);
      fd.append("description", description);
      fd.append("seller_id", user.id);
      fd.append("seller_name", user.name);
      if (user.username) fd.append("seller_username", user.username);
      if (file) fd.append("image", file);

      const res = await fetch("/api/listings", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) window.location.href = "/";
      else alert(data.error ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-6">
      <a href="/" className="text-blue-300/90 hover:text-blue-200">← Back</a>

      <div className="mt-4 cardGlass glow rounded-3xl p-5">
        <h2 className="text-2xl font-bold">Post a listing</h2>
        <p className="mt-1 subtle">Supabase + real photo upload (Storage).</p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-sm subtle">Title</div>
            <input className="inp" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., IKEA Chair" />
          </label>

          <label className="block">
            <div className="mb-1 text-sm subtle">Price</div>
            <input className="inp" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </label>

          <label className="block">
            <div className="mb-1 text-sm subtle">Currency</div>
            <input className="inp" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </label>

          <label className="block">
            <div className="mb-1 text-sm subtle">Category</div>
            <select className="inp" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              <option value="Books">Books</option>
              <option value="Tech">Tech</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothes">Clothes</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm subtle">Condition</div>
            <select className="inp" value={condition} onChange={(e) => setCondition(e.target.value as Condition)}>
              <option value="New">New</option>
              <option value="Like new">Like new</option>
              <option value="Used">Used</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm subtle">Photo (jpg/png/webp)</div>
            <input
              className="inp !py-2"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <label className="block mt-3">
          <div className="mb-1 text-sm subtle">Description</div>
          <textarea className="inp min-h-[110px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Pickup, accessories, details..." />
        </label>

        <button
          onClick={submit}
          className="mt-5 w-full btn btnPrimary disabled:opacity-40"
          disabled={busy || !title.trim() || price <= 0}
        >
          {busy ? "Publishing..." : "Publish"}
        </button>

        <div className="mt-3 text-xs muted">
          Posting as: <b>{user.name}</b> ({user.username ?? "no username"}) • id: {user.id}
        </div>
      </div>
    </div>
  );
}
