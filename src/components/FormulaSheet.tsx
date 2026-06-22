import React, { useState } from "react";
import { Search, BookOpen, Plus, Info, Check, CornerDownLeft } from "lucide-react";
import { formulaLibrary } from "../data/formulas";
import { MathFormula } from "../types";

interface FormulaSheetProps {
  onInsertFormula: (formulaText: string) => void;
  theme?: "dark" | "light";
}

export default function FormulaSheet({ onInsertFormula, theme = "dark" }: FormulaSheetProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [insertedId, setInsertedId] = useState<string | null>(null);
  const isLight = theme === "light";

  const categories = ["All", "Algebra", "Calculus", "Geometry", "Trig", "Physics"];

  const filteredFormulas = formulaLibrary.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsert = (formula: MathFormula) => {
    onInsertFormula(formula.calculatorInsert);
    setInsertedId(formula.name);
    setTimeout(() => setInsertedId(null), 1500);
  };

  return (
    <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-200 ${
      isLight ? "bg-slate-50" : "bg-slate-900"
    }`}>
      {/* Title Header */}
      <div className={`p-4 border-b transition-colors duration-250 ${
        isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800"
      }`}>
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <BookOpen className={`w-5 h-5 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
          <span className={isLight ? "text-slate-900" : "text-slate-100"}>Formula Reference</span>
        </h2>
        <p className={`text-xs mt-1 transition-colors duration-200 ${
          isLight ? "text-slate-500" : "text-slate-400"
        }`}>
          Browse textbook formulas and load them directly into the calculator terminal.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className={`p-3 space-y-2 border-b transition-colors duration-250 ${
        isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800/80"
      }`}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search equations, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full text-xs rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 border transition-all duration-150 ${
              isLight
                ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                : "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500"
            }`}
          />
        </div>

        {/* Category Filters scroll */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-[11px] rounded-full whitespace-nowrap transition-all duration-150 border ${
                selectedCategory === cat
                  ? isLight
                    ? "bg-cyan-50 text-cyan-800 border-cyan-300 font-medium"
                    : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 font-medium"
                  : isLight
                    ? "bg-slate-100/80 hover:bg-slate-200 text-slate-650 border-transparent"
                    : "bg-slate-900 text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas List Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredFormulas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Info className="w-8 h-8 text-slate-500 mb-2" />
            <p className="text-xs text-slate-400">No formula matches found for "{search}"</p>
          </div>
        ) : (
          filteredFormulas.map((item) => (
            <div
              key={item.name}
              className={`group border rounded-xl p-3.5 transition-all duration-150 relative overflow-hidden flex flex-col justify-between shadow-sm ${
                isLight
                  ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow"
                  : "bg-slate-950/60 hover:bg-slate-950 border-slate-800/70 hover:border-slate-700/80"
              }`}
            >
              <div>
                {/* Topic Metadata & Category badge */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                    isLight
                      ? "bg-cyan-50 text-cyan-705 border-cyan-200"
                      : "bg-cyan-950/40 text-cyan-400 border border-cyan-900/40"
                  }`}>
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleInsert(item)}
                    className={`flex items-center space-x-1 px-2.5 py-1 text-[10px] rounded-md border font-medium transition-all duration-150 ${
                      insertedId === item.name
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        : isLight
                          ? "bg-slate-55 text-slate-705 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm"
                          : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {insertedId === item.name ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Loaded!</span>
                      </>
                    ) : (
                      <>
                        <CornerDownLeft className={`w-3 h-3 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
                        <span>Insert Formula</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formula Display Name */}
                <h3 className={`text-xs font-semibold ${isLight ? "text-slate-850" : "text-slate-100"}`}>{item.name}</h3>

                {/* Render styled graphic Representation */}
                <div className={`my-2 px-3 py-2 rounded-lg text-center font-serif text-sm tracking-wide border overflow-x-auto whitespace-pre ${
                  isLight
                    ? "bg-slate-50 text-cyan-800 border-slate-100/80"
                    : "bg-slate-900/80 text-cyan-205 border-slate-850"
                }`}>
                  {item.equation}
                </div>

                <p className={`text-[11px] leading-relaxed mt-1 ${isLight ? "text-slate-550" : "text-slate-400"}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
