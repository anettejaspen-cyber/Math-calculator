import React, { useState, useEffect } from "react";
import {
  Calculator,
  Camera,
  BookOpen,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  X,
  Trash2,
  Bookmark,
  Star
} from "lucide-react";

import MobileFrame from "./components/MobileFrame";
import ScientificCalculator from "./components/ScientificCalculator";
import ScanTab from "./components/ScanTab";
import FormulaSheet from "./components/FormulaSheet";
import SolutionScreen from "./components/SolutionScreen";
import { MathSolution, SolutionHistoryItem } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"calc" | "scan" | "formulas" | "history" | "solution">(
    "calc"
  );
  const [expression, setExpression] = useState("");
  const [activeSolution, setActiveSolution] = useState<MathSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("Initializing Tutor...");
  const [errorContext, setErrorContext] = useState<string | null>(null);

  // Load theme preference from localStorage or standard default (dark)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const stored = localStorage.getItem("math_solver_theme");
      return (stored === "light" || stored === "dark") ? stored : "dark";
    } catch {
      return "dark";
    }
  });

  // Synchronize theme preference to storage
  useEffect(() => {
    try {
      localStorage.setItem("math_solver_theme", theme);
    } catch (err) {
      console.error("Local storage theme sync error:", err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isLight = theme === "light";

  // Load persistence search logs from localStorage
  const [history, setHistory] = useState<SolutionHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem("math_solver_history_v1");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Synchronize search logs
  useEffect(() => {
    try {
      localStorage.setItem("math_solver_history_v1", JSON.stringify(history));
    } catch (err) {
      console.error("Local storage sync error:", err);
    }
  }, [history]);

  // Loading phase rotation animations (very high craft / charming)
  useEffect(() => {
    if (!isLoading) return;
    const phases = [
      "Running Optical OCR scan...",
      "Analyzing math structures...",
      "Extracting variable coefficients...",
      "Running step-by-step calculus engines...",
      "Formulating tutor tips...",
      "Drafting practice match challenges..."
    ];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phases.length;
      setLoadingPhase(phases[currentIndex]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Solve photo scans
  const handleSolveUploadedImage = async (
    base64Image: string,
    mimeType: string,
    additionalPrompt: string
  ) => {
    setIsLoading(true);
    setLoadingPhase("Analyzing paper homework template...");
    setErrorContext(null);

    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          mimeType,
          additionalPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze homework image.");
      }

      const parsedSolution: MathSolution = await response.json();
      setActiveSolution(parsedSolution);
      setActiveTab("solution");

      // Save item into local history
      const logItem: SolutionHistoryItem = {
        id: crypto.randomUUID(),
        problem: parsedSolution.problem || "Scanned Problem",
        category: parsedSolution.category || "General Math",
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        isFavorite: false,
        solution: parsedSolution
      };

      setHistory((prev) => [logItem, ...prev]);

    } catch (err: any) {
      console.error("Solver error:", err);
      setErrorContext(err.message || "Something went wrong during image recognition.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typed expressions solves
  const handleSolveTypedExpression = async (expr: string) => {
    if (!expr.trim()) return;
    setIsLoading(true);
    setLoadingPhase("Solving typed algebraic formula...");
    setErrorContext(null);

    try {
      const response = await fetch("/api/solve-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: expr
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to solve algebraic function.");
      }

      const parsedSolution: MathSolution = await response.json();
      setActiveSolution(parsedSolution);
      setActiveTab("solution");

      // Save item into local history
      const logItem: SolutionHistoryItem = {
        id: crypto.randomUUID(),
        problem: parsedSolution.problem || expr,
        category: parsedSolution.category || "Typed Formula",
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        isFavorite: false,
        solution: parsedSolution
      };

      setHistory((prev) => [logItem, ...prev]);

    } catch (err: any) {
      console.error("Solver error:", err);
      setErrorContext(err.message || "Something went wrong solving typed expression.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: SolutionHistoryItem) => {
    setActiveSolution(item.solution);
    setActiveTab("solution");
  };

  const handleToggleFavoriteHistory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const isCurrentSolutionFavorite = () => {
    if (!activeSolution) return false;
    const found = history.find((h) => h.solution.problem === activeSolution.problem);
    return found ? found.isFavorite : false;
  };

  const toggleCurrentSolutionFavorite = () => {
    if (!activeSolution) return;
    const found = history.find((h) => h.solution.problem === activeSolution.problem);
    if (found) {
      handleToggleFavoriteHistory(found.id);
    }
  };

  const handleInsertFormulaToCalculator = (formulaText: string) => {
    setExpression(formulaText);
    setActiveTab("calc");
  };

  return (
    <MobileFrame cameraActive={activeTab === "scan"} theme={theme} onToggleTheme={toggleTheme}>
      <div className={`flex-1 flex flex-col overflow-hidden justify-between transition-colors duration-200 ${
        isLight ? "bg-slate-100" : "bg-slate-900"
      }`}>
        
        {/* Core Loading Glass Overlays */}
        {isLoading && (
          <div className={`absolute inset-x-0 bottom-[56px] top-10 flex flex-col items-center justify-center space-y-4 px-6 z-40 animate-fadeIn ${
            isLight ? "bg-slate-100/95" : "bg-slate-950/90"
          }`}>
            <div className={`p-4 border rounded-2xl flex items-center justify-center animate-bounce ${
              isLight ? "bg-cyan-50 border-cyan-200" : "bg-cyan-950/40 border-cyan-800/30"
            }`}>
              <Sparkles className={`w-10 h-10 animate-pulse ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
            </div>
            
            <div className="text-center space-y-1.5">
              <h4 className={`text-sm font-semibold uppercase tracking-widest font-mono ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}>
                AI Math Tutor
              </h4>
              <p className={`text-xs font-mono tracking-wide ${isLight ? "text-cyan-600" : "text-cyan-400"}`}>
                {loadingPhase}
              </p>
            </div>

            <div className={`w-48 h-1 rounded-full overflow-hidden border ${
              isLight ? "bg-slate-200 border-slate-300" : "bg-slate-900 border-slate-800"
            }`}>
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 w-2/3 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Global Error Context overlay */}
        {errorContext && (
          <div className={`absolute inset-x-0 bottom-[56px] top-10 flex flex-col p-6 overflow-y-auto justify-center z-45 animate-fadeIn ${
            isLight ? "bg-slate-100/95" : "bg-slate-950"
          }`}>
            <div className={`border rounded-2xl p-5 space-y-4 max-w-sm mx-auto shadow-xl ${
              isLight ? "bg-white border-rose-250" : "bg-rose-500/10 border-rose-500/20"
            }`}>
              <div className="flex items-center space-x-3 text-rose-500">
                <AlertCircle className="w-7 h-7 shrink-0" />
                <h3 className="text-sm font-bold uppercase tracking-wider">AI Tutor Blocked</h3>
              </div>
              
              <div className={`space-y-3.5 text-xs leading-normal ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                <p className={`font-semibold break-words p-2.5 rounded border ${
                  isLight 
                    ? "bg-slate-50 border-slate-200 text-slate-800" 
                    : "bg-slate-900/80 border-slate-800 text-slate-100"
                }`}>
                  {errorContext}
                </p>

                {errorContext.includes("GEMINI_API_KEY") && (
                  <div className={`space-y-2 pt-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    <strong className={`block font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                      🛠️ Quick Secret Setup Guide:
                    </strong>
                    <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
                      <li>
                        Taps the <strong className={isLight ? "text-slate-800" : "text-slate-200"}>Settings gear (top right)</strong> on the platform screen.
                      </li>
                      <li>
                        Selects the <strong className={isLight ? "text-slate-700" : "text-slate-350"}>Secrets tab</strong>.
                      </li>
                      <li>
                        Adds a secret with name: <code className="bg-slate-200 text-cyan-705 px-1 py-0.5 rounded font-mono font-bold">GEMINI_API_KEY</code>
                      </li>
                      <li>Paste your legitimate key & click save. Run evaluation again!</li>
                    </ol>
                  </div>
                )}
              </div>

              <button
                onClick={() => setErrorContext(null)}
                className={`w-full h-9 rounded-lg text-xs font-semibold tracking-wide transition active:scale-95 border ${
                  isLight
                    ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-800"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                Dismiss & Try Again
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Display Panels */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === "calc" && (
            <ScientificCalculator
              expression={expression}
              setExpression={setExpression}
              onSolveTypedExpression={handleSolveTypedExpression}
              theme={theme}
            />
          )}

          {activeTab === "scan" && (
            <ScanTab onSolveUploadedImage={handleSolveUploadedImage} isLoading={isLoading} theme={theme} />
          )}

          {activeTab === "formulas" && (
            <FormulaSheet onInsertFormula={handleInsertFormulaToCalculator} theme={theme} />
          )}

          {activeTab === "solution" && activeSolution && (
            <SolutionScreen
              solution={activeSolution}
              onGoBack={() => setActiveTab("calc")}
              isFavorite={isCurrentSolutionFavorite()}
              onToggleFavorite={toggleCurrentSolutionFavorite}
              theme={theme}
            />
          )}

          {activeTab === "history" && (
            <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-200 ${
              isLight ? "bg-slate-100" : "bg-slate-900"
            }`}>
              <div className={`p-4 border-b shrink-0 transition-colors duration-200 ${
                isLight ? "bg-white border-slate-205" : "bg-slate-950 border-slate-800/80"
              }`}>
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <Clock className={`w-5 h-5 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
                  <span className={isLight ? "text-slate-900" : "text-slate-100"}>Homework Scan History</span>
                </h2>
                <p className={`text-xs mt-1 font-sans ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Recover audited explanations and review previous steps again.
                </p>
              </div>

              {/* History index */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
                    <HelpCircle className={`w-10 h-10 mb-2.5 ${isLight ? "text-slate-300" : "text-slate-650"}`} />
                    <p className={`text-xs max-w-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                      No scanned problems stored yet. Head to the scan window to analyze your first assignment!
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className={`border rounded-xl p-3.5 transition-all duration-150 cursor-pointer flex items-center justify-between ${
                        isLight
                          ? "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm"
                          : "bg-slate-950 hover:bg-slate-950/80 border border-slate-800 hover:border-slate-700/80"
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden pr-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] border px-1.5 py-0.5 rounded font-bold uppercase ${
                            isLight
                              ? "bg-cyan-50 text-cyan-600 border-cyan-200"
                              : "bg-cyan-950/50 text-cyan-400 border border-cyan-900/40"
                          }`}>
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-mono ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                            {item.timestamp}
                          </span>
                        </div>
                        <h4 className={`text-xs font-semibold truncate leading-snug ${
                          isLight ? "text-slate-850" : "text-slate-200"
                        }`}>
                          {item.problem}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={(e) => handleToggleFavoriteHistory(item.id, e)}
                          className={`p-1.5 rounded-lg border transition duration-100 ${
                            item.isFavorite
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              : isLight
                                ? "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className={`p-1.5 rounded-lg border transition duration-100 ${
                            isLight
                              ? "bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-500"
                              : "bg-slate-900 hover:bg-rose-505/10 border border-slate-800 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Bottom Navigation Bar inside frame */}
        <div className={`h-14 border-t flex items-center justify-around px-4 z-30 shrink-0 transition-colors duration-200 ${
          isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-850"
        }`}>
          <button
            onClick={() => setActiveTab("calc")}
            className={`flex flex-col items-center justify-center transition-all duration-150 ${
              activeTab === "calc"
                ? isLight
                  ? "text-cyan-600 scale-105 font-bold"
                  : "text-cyan-400 scale-105"
                : isLight
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-550 hover:text-slate-300"
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-0.5 font-sans">Calculator</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("scan");
              setExpression("");
            }}
            className={`flex flex-col items-center justify-center transition-all duration-150 ${
              activeTab === "scan"
                ? isLight
                  ? "text-cyan-600 scale-105 font-bold"
                  : "text-cyan-400 scale-105"
                : isLight
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-550 hover:text-slate-300"
            }`}
          >
            <Camera className="w-5 h-5 animate-pulse" />
            <span className="text-[9px] font-semibold mt-0.5 font-sans">Scan Homework</span>
          </button>

          <button
            onClick={() => setActiveTab("formulas")}
            className={`flex flex-col items-center justify-center transition-all duration-150 ${
              activeTab === "formulas"
                ? isLight
                  ? "text-cyan-600 scale-105 font-bold"
                  : "text-cyan-400 scale-105"
                : isLight
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-550 hover:text-slate-300"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-0.5 font-sans">Cheat Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center justify-center transition-all duration-150 ${
              activeTab === "history"
                ? isLight
                  ? "text-cyan-600 scale-105 font-bold"
                  : "text-cyan-400 scale-105"
                : isLight
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-550 hover:text-slate-300"
            }`}
          >
            <div className="relative">
              <Clock className="w-5 h-5" />
              {history.length > 0 && (
                <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${
                  isLight ? "bg-cyan-600" : "bg-cyan-400"
                }`} />
              )}
            </div>
            <span className="text-[9px] font-semibold mt-0.5 font-sans">Audit Log</span>
          </button>
        </div>

      </div>
    </MobileFrame>
  );
}
