import { MathFormula } from "../types";

export const formulaLibrary: MathFormula[] = [
  {
    name: "Quadratic Formula",
    equation: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    description: "Finds the roots of any quadratic equation of the form ax² + bx + c = 0.",
    category: "Algebra",
    calculatorInsert: "(-b + sqrt(b^2 - 4*a*c))/(2*a)"
  },
  {
    name: "Slope-Intercept",
    equation: "y = mx + b",
    description: "Determines the equation of a straight line given slope (m) and y-intercept (b).",
    category: "Algebra",
    calculatorInsert: "m*x + b"
  },
  {
    name: "Derivative of xⁿ",
    equation: "\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}",
    description: "Fundamental Power Rule for basic derivatives in introductory calculus.",
    category: "Calculus",
    calculatorInsert: "n * x^(n-1)"
  },
  {
    name: "Pythagorean Theorem",
    equation: "a^2 + b^2 = c^2",
    description: "Standard equation relating base sides of any right-angle triangle.",
    category: "Geometry",
    calculatorInsert: "sqrt(a^2 + b^2)"
  },
  {
    name: "Area of a Circle",
    equation: "A = \\pi r^2",
    description: "Calculates total surface coverage inside a circle of radius r.",
    category: "Geometry",
    calculatorInsert: "pi * r^2"
  },
  {
    name: "Trig Fundamental Identity",
    equation: "\\sin^2(\\theta) + \\cos^2(\\theta) = 1",
    description: "Most integral periodic identity connecting sine and cosine outputs.",
    category: "Trig",
    calculatorInsert: "sin(θ)^2 + cos(θ)^2"
  },
  {
    name: "Einstein's Mass-Energy",
    equation: "E = m \\cdot c^2",
    description: "Famous relativistic equivalence of mass and internal energy.",
    category: "Physics",
    calculatorInsert: "m * (3 * 10^8)^2"
  },
  {
    name: "Kinetic Energy",
    equation: "E_k = \\frac{1}{2}m v^2",
    description: "Determines energy of a moving physical mass based on constant velocity v.",
    category: "Physics",
    calculatorInsert: "0.5 * m * v^2"
  }
];
