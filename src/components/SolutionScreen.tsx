import React, { useState } from "react";
import { MathSolution } from "../types";
import { ArrowLeft, Sparkles, AlertCircle, Lightbulb, CheckCircle2, Bookmark, Star, HelpCircle } from "lucide-react";

interface SolutionScreenProps {
  solution: MathSolution;
  onGoBack: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  theme?: "dark" | "light";
}

export default function SolutionScreen({
  solution,
  onGoBack,
  onToggleFavorite,
  isFavorite = false,
  theme = "dark"
}: SolutionScreenProps) {
  const [activeStepTips, setActiveStepTips] = useState<Record<number, boolean>>({});
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [showPracticeHint, setShowPracticeHint] = useState<Record<number, boolean>>({});
  const [showPracticeAnswerReveal, setShowPracticeAnswerReveal] = useState<Record<number, boolean>>({});
  const isLight = theme === "light";

  const toggleTip = (stepIndex: number) => {
    setActiveStepTips((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  const difficultyColors = {
    easy: isLight 
      ? "text-emerald-700 bg-emerald-50 border-emerald-200" 
      : "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    medium: isLight 
      ? "text-amber-700 bg-amber-50 border-amber-200" 
      : "text-amber-400 bg-amber-950/40 border-amber-800/40",
    hard: isLight 
      ? "text-rose-700 bg-rose-50 border-rose-250" 
      : "text-rose-400 bg-rose-950/40 border-rose-800/40",
    default: isLight 
      ? "text-cyan-700 bg-cyan-50 border-cyan-200" 
      : "text-cyan-400 bg-cyan-950/40 border-cyan-800/40"
  };

  const getDifficultyStyle = (str: string) => {
    const l = str?.toLowerCase() || "";
    if (l.includes("easy")) return difficultyColors.easy;
    if (l.includes("medium") || l.includes("intermediate")) return difficultyColors.medium;
    if (l.includes("hard") || l.includes("difficult")) return difficultyColors.hard;
    return difficultyColors.default;
  };

  const handlePracticeCheck = () => {
    if (practiceAnswer.trim()) {
      setPracticeCompleted(true);
    }
  };

  return (
    <div className={`flex-1 flex flex-col overflow-hidden relative transition-colors duration-200 ${
      isLight ? "bg-slate-50" : "bg-slate-900"
    }`}>
      
      {/* Absolute Loading / Solved Screen Sticky Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 transition-colors duration-200 ${
        isLight ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800/60"
      }`}>
        <button
          onClick={onGoBack}
          className={`p-1 px-2.5 rounded-lg border text-xs font-semibold transition active:scale-95 flex items-center space-x-1 ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700 shadow-sm"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>

        <span className={`text-xs font-bold tracking-wider uppercase font-mono ${
          isLight ? "text-cyan-700" : "text-cyan-400"
        }`}>
          AI Explainer active
        </span>

        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg border transition active:scale-95 ${
              isFavorite
                ? isLight
                  ? "bg-amber-50 text-amber-600 border-amber-300"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : isLight
                  ? "bg-white text-slate-400 border-slate-200 hover:text-slate-650"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-400 text-amber-500" : ""}`} />
          </button>
        )}
      </div>

      {/* Solutions Narrative Viewer (Scrollable workspace) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Homework Header summary card */}
        <div className={`rounded-xl p-4 border space-y-3 transition-colors duration-200 ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-950 border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${getDifficultyStyle(solution.difficulty)}`}>
              {solution.difficulty || "Medium"} Category
            </span>
            <span className={`text-[11px] font-semibold ${isLight ? "text-cyan-705" : "text-cyan-400"}`}>
              {solution.category || "General Mathematics"}
            </span>
          </div>

          <h3 className={`text-xl font-light tracking-tight p-3 rounded-lg border break-words font-serif text-center transition-colors duration-200 ${
            isLight
              ? "bg-slate-50 border-slate-100/90 text-slate-900"
              : "bg-slate-900/60 border-slate-850/50 text-slate-100"
          }`}>
            {solution.problem}
          </h3>

          {/* Key formula concept tags */}
          {solution.keyConcepts && solution.keyConcepts.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {solution.keyConcepts.map((concept) => (
                <span
                  key={concept}
                  className={`text-[10px] border rounded px-2 py-0.5 ${
                    isLight
                      ? "text-slate-650 bg-slate-100/60 border-slate-200"
                      : "text-slate-300 bg-slate-900 border border-slate-800/80"
                  }`}
                >
                  📖 {concept}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timeline step container */}
        <div className={`space-y-4 relative pl-3 border-l-2 ml-2 pt-2 pb-1 ${
          isLight ? "border-slate-200" : "border-slate-800/80"
        }`}>
          {solution.steps?.map((step, idx) => {
            const hasTip = !!step.tip;
            const tipOpen = !!activeStepTips[idx];

            return (
              <div key={idx} className="relative pb-1">
                
                {/* Timeline ball index */}
                <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 shadow ${
                  isLight
                    ? "bg-white border-cyan-500 text-cyan-700 shadow-cyan-200"
                    : "bg-slate-900 border-cyan-400 text-cyan-400 shadow-cyan-500/20"
                }`} />

                {/* Step contents card */}
                <div className={`border rounded-xl p-3.5 transition-all duration-150 space-y-2 ml-2 ${
                  isLight
                    ? "bg-white hover:bg-slate-50/50 border-slate-200 shadow-sm"
                    : "bg-slate-950/60 hover:bg-slate-950/90 border-slate-800/60"
                }`}>
                  <div className="flex items-start justify-between">
                    <h4 className={`text-xs font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                      Step {step.step}: {step.title}
                    </h4>
                    
                    {hasTip && (
                      <button
                        onClick={() => toggleTip(idx)}
                        className={`text-[9px] font-semibold flex items-center space-x-0.5 px-2 py-0.5 rounded transition border ${
                          tipOpen
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : isLight
                              ? "bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-700"
                              : "bg-slate-900 text-slate-400 border-transparent hover:text-slate-200"
                        }`}
                      >
                        <Lightbulb className="w-2.5 h-2.5 text-amber-500" />
                        <span>Teacher Tip</span>
                      </button>
                    )}
                  </div>

                  {/* Step intermediate evaluation Math display */}
                  {step.expression && (
                    <div className={`p-2.5 border rounded-lg text-center font-mono text-xs tracking-wide overflow-x-auto whitespace-pre ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-cyan-800"
                        : "bg-slate-950 border-slate-850 text-cyan-300"
                    }`}>
                      {step.expression}
                    </div>
                  )}

                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-350"
                  }`}>
                    {step.explanation}
                  </p>

                  {/* Collapsible Teacher tip segment */}
                  {hasTip && tipOpen && (
                    <div className={`p-2.5 border rounded-lg text-[10px] leading-normal flex items-start space-x-1.5 mt-2 animate-fadeIn ${
                      isLight
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-amber-950/20 border-amber-900/30 text-amber-300"
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block mb-0.5">Common Student Trap:</strong>
                        <span>{step.tip}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final target solution highlights golden panel */}
        <div className={`border rounded-xl p-4 space-y-1.5 shadow-sm ${
          isLight
            ? "bg-emerald-500/5 border-emerald-300"
            : "bg-gradient-to-r from-emerald-950/30 to-emerald-950/10 border-emerald-500/20"
        }`}>
          <span className={`text-[9px] uppercase font-extrabold tracking-wider flex items-center space-x-1 ${
            isLight ? "text-emerald-700" : "text-emerald-400"
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100/10" />
            <span>Terminal Solution Verified</span>
          </span>
          <div className={`text-xl font-mono font-bold p-2 border rounded-lg text-center select-all ${
            isLight
              ? "bg-white border-emerald-200 text-emerald-800"
              : "bg-emerald-950/40 border-emerald-900/40 text-slate-100"
          }`}>
            {solution.finalAnswer}
          </div>
        </div>

        {/* Interactive Practice checkpoint playground */}
        {solution.practiceMatches && solution.practiceMatches.length > 0 && (
          <div className={`border rounded-xl p-4 space-y-3.5 ${
            isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-950 border-slate-800"
          }`}>
            <div className="flex items-center justify-between">
              <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center space-x-1 ${
                isLight ? "text-slate-800" : "text-sans text-slate-200"
              }`}>
                <Sparkles className={`w-4 h-4 animate-pulse ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
                <span>Concept practice Drill</span>
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                isLight
                  ? "bg-cyan-50 border-cyan-200 text-cyan-800"
                  : "bg-cyan-950 text-cyan-300 border-none"
              }`}>
                Practice Mode
              </span>
            </div>

            {solution.practiceMatches.map((practice, index) => {
              const hintVisible = !!showPracticeHint[index];
              const answerVisible = !!showPracticeAnswerReveal[index];

              return (
                <div key={index} className="space-y-3">
                  <p className={`text-xs p-3 rounded-lg border border-dashed leading-relaxed font-serif italic text-center ${
                    isLight
                      ? "bg-slate-50 border-slate-300 text-slate-700"
                      : "bg-slate-900 border-slate-850 text-slate-350"
                  }`}>
                    "{practice.question}"
                  </p>

                  {/* Input draft workspace */}
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Type your final drafted answer..."
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      disabled={practiceCompleted}
                      className={`w-full border rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-550 disabled:opacity-60 transition-all ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-405"
                          : "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500"
                      }`}
                    />

                    <div className="flex space-x-1.5 justify-end">
                      <button
                        onClick={() => setShowPracticeHint(prev => ({ ...prev, [index]: !prev[index] }))}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded transition border ${
                          isLight
                            ? "bg-white hover:bg-slate-50 text-slate-600 border-slate-205"
                            : "bg-slate-900 hover:bg-slate-855 text-slate-400 hover:text-slate-200 border-slate-800"
                        }`}
                      >
                        {hintVisible ? "Hide Hint" : "Get Hint"}
                      </button>
                      <button
                        onClick={() => setShowPracticeAnswerReveal(prev => ({ ...prev, [index]: !prev[index] }))}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded transition border ${
                          isLight
                            ? "bg-white hover:bg-slate-50 text-slate-600 border-slate-205"
                            : "bg-slate-900 hover:bg-slate-855 text-slate-400 hover:text-slate-200 border-slate-800"
                        }`}
                      >
                        {answerVisible ? "Hide Answer" : "Reveal Answer"}
                      </button>
                      <button
                        onClick={handlePracticeCheck}
                        disabled={practiceCompleted || !practiceAnswer.trim()}
                        className="text-[10px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded transition disabled:opacity-30"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>

                  {/* Practice Hint text */}
                  {hintVisible && (
                    <div className={`p-2.5 border border-dashed rounded-lg text-[10px] leading-normal flex items-start space-x-1.5 animate-fadeIn ${
                      isLight
                        ? "bg-cyan-50/65 border-cyan-200 text-slate-700"
                        : "bg-slate-900 border-slate-800 text-cyan-300"
                    }`}>
                      <HelpCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
                      <div>
                        <strong className="font-semibold block mb-0.5">Tutor's Starter Hint:</strong>
                        <span>{practice.hint}</span>
                      </div>
                    </div>
                  )}

                  {/* Practice Answer Reveal */}
                  {answerVisible && (
                    <div className={`p-2.5 border rounded-lg text-[10px] leading-normal flex items-start space-x-1.5 animate-fadeIn ${
                      isLight
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block mb-0.5">Recommended Tutor Answer Key:</strong>
                        <span>Try setting up equation bounds or variables based on your homework steps. Focus on matching units!</span>
                      </div>
                    </div>
                  )}

                  {/* Submitted practice status feedback */}
                  {practiceCompleted && (
                    <div className={`p-3 border rounded-lg text-xs leading-normal flex items-start space-x-2 animate-fadeIn shadow-sm ${
                      isLight
                        ? "bg-emerald-50 border-emerald-250 text-slate-800"
                        : "bg-emerald-500/10 border-emerald-500/20 text-slate-200"
                    }`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-505 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-emerald-700 mb-0.5">Excellent Workout effort!</span>
                        <span>Solving similar drills trains math intuition. Keep scanning assignments to review and master complex homework topics.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
