import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EditorCard from "./EditorCard.jsx";
import { useApp } from "../context/AppContext.jsx";

const categories = ["Semua", "Short-Form", "YouTube", "Podcast", "Cinematic", "Vlog", "Motion", "Gaming"];

const controlBase =
  "flex h-[38px] items-center rounded-[19px] border border-chip-line bg-chip px-[16px] text-[12.5px] font-medium text-soft";

export default function EditorCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { editors, filterEditors } = useApp();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "Semua";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const filteredEditors = useMemo(
    () => filterEditors(query, category === "Semua" ? null : category),
    [filterEditors, query, category]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchParams({ q: value, cat: category });
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams({ q: query, cat });
  };

  const handleSortChange = (sort) => {
    // Could implement sorting here
    console.log("Sort by:", sort);
  };

  return (
    <section className="mt-[28px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[19px] font-semibold leading-[26px] text-white">
            Editor pilihan
          </h2>
          <p className="text-[11.5px] leading-[14px] text-muted">
            Diurutkan dari rating & kecepatan respon
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={`${controlBase} appearance-none bg-chip pr-8`}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => handleSortChange(e.target.value)}
            className={controlBase}
          >
            <option value="popular">Terpopuler</option>
            <option value="rating">Rating tertinggi</option>
            <option value="price_asc">Harga terendah</option>
            <option value="price_desc">Harga tertinggi</option>
            <option value="response">Respon tercepat</option>
          </select>
        </div>
      </div>

      <div className="mt-[22px] grid grid-cols-1 gap-x-5 gap-y-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {filteredEditors.map((editor) => (
          <EditorCard key={editor.id} {...editor} />
        ))}
        {filteredEditors.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center rounded-[16px] border border-dashed border-[#24242F] bg-surface">
            <p className="text-[12px] text-dim">Tidak ada editor yang cocok dengan filter</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("Semua");
                setSearchParams({ q: "", cat: "Semua" });
              }}
              className="mt-4 text-accent underline text-[11.5px]"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}