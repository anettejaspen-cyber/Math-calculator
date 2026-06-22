import React, { useState, useEffect } from "react";
import { Sparkles, Delete, HelpCircle, CornerDownRight } from "lucide-react";

interface ScientificCalculatorProps {
  expression: string;
  setExpression: (val: string) => void;
  onSolveTypedExpression: (expr: string) => void;
  theme?: "dark" | "light";
}

export default function ScientificCalculator({
  expression,
  setExpression,
  onSolveTypedExpression,
  theme = "dark"
}: ScientificCalculatorProps) {
  const [preview, setPreview] = useState<string>("");
  const [calcIsError, setCalcIsError] = useState(false);
  const isLight = theme === "light";

  // Safely evaluate math equations in real-time
  const evaluateMath = (expr: string): { value: string; isAlgebraic: boolean } => {
    try {
      if (!expr.trim()) return { value: "", isAlgebraic: false };

      // Check for variables or symbolic math characters (e.g., x, y, a, b, etc.)
      const normalized = expr.toLowerCase();
      const hasVariables = /[a-df-hj-lo-rt-uw-zθ]/.test(normalized.replace(/(sin|cos|tan|log|ln|sqrt|pi)/g, ""));

      if (hasVariables) {
        return { value: "Symbolic Algebraic Expression", isAlgebraic: true };
      }

      // Convert characters into Javascript standard Math evaluations
      let parsed = normalized
        .replace(/pi/g, String(Math.PI))
        .replace(/π/g, String(Math.PI))
        .replace(/e/g, String(Math.E))
        .replace(/\^/g, "**")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sqrt\(/g, "Math.sqrt(");

      // Perform a safety evaluation block check
      // Ensure only numbers, math operations, and safe Math functions are executed
      const safeCheck = parsed.replace(/Math\.(sin|cos|tan|log10|log|sqrt|PI|E)/g, "");
      if (/[^0-9+\-*/().\s*]/.test(safeCheck.replace(/\*\*/g, ""))) {
        return { value: "Formula Format", isAlgebraic: true };
      }

      const evalResult = new Function(`return (${parsed});`)();
      if (typeof evalResult === "number") {
        if (isNaN(evalResult)) return { value: "Error", isAlgebraic: false };
        if (!isFinite(evalResult)) return { value: "Infinity", isAlgebraic: false };
        
        // Round cleanly to prevent decimal expansion artifacts
        const rounded = Math.round(evalResult * 100000000) / 100000000;
        return { value: String(rounded), isAlgebraic: false };
      }
      return { value: "", isAlgebraic: false };
    } catch {
      return { value: "", isAlgebraic: false };
    }
  };

  useEffect(() => {
    const res = evaluateMath(expression);
    if (res.value === "Error") {
      setPreview("");
    } else {
      setPreview(res.value);
    }
  }, [expression]);

  const handleKeyPress = (char: string) => {
    setCalcIsError(false);
    if (char === "AC") {
      setExpression("");
      setPreview("");
    } else if (char === "DEL") {
      setExpression(expression.slice(0, -1));
    } else if (char === "=") {
      const res = evaluateMath(expression);
      if (res.value && res.value !== "Error" && !res.isAlgebraic) {
        setExpression(res.value);
        setPreview("");
      } else if (res.isAlgebraic) {
        // Direct bridge to AI Solver for algebra expressions
        onSolveTypedExpression(expression);
      } else {
        setCalcIsError(true);
      }
    } else {
      setExpression(expression + char);
    }
  };

  const calcButtons = [
    { label: "sin", type: "sci", val: "sin(" },
    { label: "cos", type: "sci", val: "cos(" },
    { label: "tan", type: "sci", val: "tan(" },
    { label: "π", type: "sci", val: "π" },
    
    { label: "log", type: "sci", val: "log(" },
    { label: "ln", type: "sci", val: "ln(" },
    { label: "^", type: "sci", val: "^" },
    { label: "√", type: "sci", val: "sqrt(" },

    { label: "(", type: "helper", val: "(" },
    { label: ")", type: "helper", val: ")" },
    { label: "x", type: "var", val: "x" },
    { label: "DEL", type: "action", val: "DEL" },

    { label: "7", type: "num", val: "7" },
    { label: "8", type: "num", val: "8" },
    { label: "9", type: "num", val: "9" },
    { label: "÷", type: "op", val: "÷" },

    { label: "4", type: "num", val: "4" },
    { label: "5", type: "num", val: "5" },
    { label: "6", type: "num", val: "6" },
    { label: "×", type: "op", val: "×" },

    { label: "1", type: "num", val: "1" },
    { label: "2", type: "num", val: "2" },
    { label: "3", type: "num", val: "3" },
    { label: "−", type: "op", val: "-" },

    { label: "AC", type: "action", val: "AC" },
    { label: "0", type: "num", val: "0" },
    { label: ".", type: "num", val: "." },
    { label: "+", type: "op", val: "+" },
  ];

  return (
    <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-200 ${isLight ? "bg-slate-100" : "bg-slate-950"}`}>
      
      {/* Dynamic Digital LED Screen Glass */}
      <div className={`p-5 flex flex-col justify-end h-44 shrink-0 transition-colors duration-200 ${
        isLight
          ? "bg-gradient-to-b from-slate-200 to-slate-100 border-b border-slate-300 shadow-inner"
          : "bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800/60 shadow-inner"
      }`}>
        
        {/* Expression Box */}
        <div className="w-full overflow-x-auto whitespace-nowrap text-right pr-1 scrollbar-none">
          {expression ? (
            <span className={`text-2xl font-mono font-light tracking-wide transition-colors duration-200 ${
              isLight ? "text-slate-850" : "text-slate-100"
            }`}>
              {expression}
            </span>
          ) : (
            <span className={`text-xl font-mono italic transition-colors duration-200 ${
              isLight ? "text-slate-400" : "text-slate-600"
            }`}>0</span>
          )}
        </div>

        {/* Real-time Dynamic Result Preview Banner */}
        <div className="mt-3 flex items-center justify-between min-h-[30px]">
          {/* Badge for Algebra expressions */}
          {expression && /[a-df-hj-lo-rt-uw-zθ]/.test(expression.toLowerCase().replace(/(sin|cos|tan|log|ln|sqrt|pi)/g, "")) ? (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase font-bold tracking-wider animate-pulse flex items-center space-x-1 border ${
              isLight
                ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                : "bg-cyan-950/80 text-cyan-400 border border-cyan-800/40"
            }`}>
              <Sparkles className="w-2.5 h-2.5" />
              <span>Algebra Variable Active</span>
            </span>
          ) : calcIsError ? (
            <span className="text-xs text-rose-500 font-medium font-mono">Syntax Error</span>
          ) : (
            <div />
          )}

          {/* Preview Text */}
          <div className={`text-right text-sm font-mono transition-colors duration-200 ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}>
            {preview && preview !== "Formula Format" && preview !== "Symbolic Algebraic Expression" && (
              <span>= {preview}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sparks Quick solver help banner */}
      <div className={`px-4 py-2 flex items-center justify-between border-b transition-colors duration-200 ${
        isLight
          ? "bg-cyan-100/30 border-cyan-200/50"
          : "bg-cyan-950/30 border-cyan-900/30"
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles className={`w-4 h-4 animate-pulse ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
          <span className={`text-[11px] font-medium transition-colors duration-200 ${
            isLight ? "text-cyan-850" : "text-cyan-300"
          }`}>
            Type algebraic variables & ask AI explain.
          </span>
        </div>
        
        {expression.trim().length > 0 && (
          <button
            onClick={() => onSolveTypedExpression(expression)}
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded transition-all duration-150 border hover:shadow-md active:scale-95 ${
              isLight
                ? "bg-cyan-100 text-cyan-755 border-cyan-200 hover:bg-cyan-200"
                : "bg-cyan-500/20 text-cyan-200 hover:bg-cyan-50 hover:text-slate-950 border-cyan-500/30"
            }`}
          >
            Explain Formula
          </button>
        )}
      </div>

      {/* Button Keyboard Grid Workspace */}
      <div className={`flex-1 p-3.5 grid grid-cols-4 gap-2 transition-colors duration-200 ${
        isLight ? "bg-slate-100" : "bg-slate-900/80"
      }`}>
        {calcButtons.map((btn) => {
          let btnStyle = "rounded-xl font-mono text-sm font-medium transition-all duration-100 flex items-center justify-center active:scale-95 border shadow-sm ";
          
          if (btn.type === "num") {
            btnStyle += isLight
              ? "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300"
              : "bg-slate-800 hover:bg-slate-750 text-slate-100 border-slate-700/50 hover:border-slate-600";
          } else if (btn.type === "op") {
            btnStyle += isLight
              ? "bg-amber-100/70 hover:bg-amber-200/70 text-amber-700 border-amber-200/60"
              : "bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/25";
          } else if (btn.type === "sci") {
            btnStyle += isLight
              ? "bg-slate-50 text-cyan-700 border-slate-200/85 hover:bg-slate-100 hover:text-cyan-800 text-xs"
              : "bg-slate-900 text-cyan-300 border-slate-800 hover:bg-slate-850 hover:text-cyan-200 text-xs";
          } else if (btn.type === "var") {
            btnStyle += isLight
              ? "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 font-semibold italic"
              : "bg-cyan-950/40 text-cyan-400 border-cyan-900 hover:bg-cyan-950/60 font-semibold italic";
          } else if (btn.type === "action") {
            if (btn.label === "AC") {
              btnStyle += isLight
                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                : "bg-rose-500/10 text-rose-400 border-rose-500/15 hover:bg-rose-500/20";
            } else {
              btnStyle += isLight
                ? "bg-slate-100 hover:bg-slate-200 text-slate-550 border-slate-200"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200";
            }
          } else {
            btnStyle += isLight
              ? "bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-200"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850";
          }

          return (
            <button
              key={btn.label}
              onClick={() => handleKeyPress(btn.val)}
              className={btnStyle}
            >
              {btn.label === "DEL" ? <Delete className="w-4 h-4 text-slate-400" /> : btn.label}
            </button>
          );
        })}

        {/* Floating Span Action Equal sign (Longer grid position) */}
        <button
          onClick={() => handleKeyPress("=")}
          className={`col-span-4 h-12 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md active:scale-[0.98] flex items-center justify-center space-x-1.5 ${
            isLight
              ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:from-cyan-450 hover:to-cyan-350 shadow-cyan-300/20"
              : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 hover:from-cyan-500 hover:to-cyan-400 shadow-cyan-500/10"
          }`}
        >
          {/[a-df-hj-lo-rt-uw-zθ]/.test(expression.toLowerCase().replace(/(sin|cos|tan|log|ln|sqrt|pi)/g, "")) ? (
            <>
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse animate-duration-1000" />
              <span>Solve & Explain with AI Tutor</span>
            </>
          ) : (
            <>
              <CornerDownRight className="w-4 h-4 text-slate-950" />
              <span>Evaluate Constant</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
