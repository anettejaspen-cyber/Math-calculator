export interface HomeworkSample {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  problemText: string;
}

export const homeworkSamples: HomeworkSample[] = [
  {
    id: "quad",
    title: "Quadratic Roots Homework",
    category: "Algebra",
    difficulty: "Easy",
    problemText: "Solve: 3x^2 + 11x - 4 = 0"
  },
  {
    id: "calc-deriv",
    title: "Power Rule Derivatives",
    category: "Calculus",
    difficulty: "Medium",
    problemText: "Find building derivative f'(x) of: f(x) = x^3 - 4x^2 + 7x - 5"
  },
  {
    id: "geometry",
    title: "Pythagorean Dimensions",
    category: "Geometry",
    difficulty: "Easy",
    problemText: "Right Triangle Hypotenuse: Side a = 5cm, Side b = 12cm. Find side c."
  },
  {
    id: "integral",
    title: "Definite Integration",
    category: "Calculus",
    difficulty: "Hard",
    problemText: "Evaluate the definite integral limit: ∫ from 1 to 3 of (3x^2 + 2x) dx"
  }
];

export function generateHomeworkSampleDataURL(id: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Draw warm paper background (Notebook style)
  ctx.fillStyle = "#FAF6EE"; // Creamy notebook paper color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw grid lines (Faint blue graphing lines)
  ctx.strokeStyle = "rgba(43, 108, 176, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // 3. Draw red margins (Student homework layout)
  ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(70, canvas.height);
  ctx.stroke();

  // 4. Header details (Name, Class, Date doodles)
  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  ctx.font = "italic 16px 'Comic Sans MS', cursive, sans-serif";
  ctx.fillText("Name: Liam Cooper", 85, 40);
  ctx.fillText("Class: Math AP Advanced", 85, 65);
  ctx.fillText("Homework Assignment #4", 360, 40);

  // Divider bar under header
  ctx.strokeStyle = "rgba(15, 23, 42, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 80);
  ctx.lineTo(580, 80);
  ctx.stroke();

  // 5. Select Math Problem Handwriting to render
  ctx.fillStyle = "#1E293B"; // Dark pencil charcoal color
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = "#1E293B";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (id === "quad") {
    // Homework Question Label
    ctx.font = "bold 22px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Problem 1: Solve for real roots of x", 90, 130);
    
    // Pencil-drawn actual mathematical formula
    ctx.font = "38px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("3x² + 11x - 4 = 0", 150, 210);

    // Some faint assistant student calculations scratchpad
    ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
    ctx.font = "italic 18px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Hint: ax² + bx + c = 0", 160, 270);
    ctx.fillText("a=3, b=11, c=-4", 160, 300);
    ctx.fillText("Find b² - 4ac first...", 160, 330);

  } else if (id === "calc-deriv") {
    ctx.font = "bold 22px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Problem 2: Find first derivative", 90, 130);

    ctx.font = "32px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("f(x) = x³ - 4x² + 7x - 5", 130, 210);

    ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
    ctx.font = "italic 18px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Find f'(x) using power rule:", 140, 275);
    ctx.fillText("d/dx [xⁿ] = n · xⁿ⁻¹", 140, 310);

  } else if (id === "geometry") {
    ctx.font = "bold 22px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Problem 3: Find hypotenuse c", 90, 120);

    // Draw Right-Triangle Doodles
    ctx.strokeStyle = "#0F172A";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(150, 170); // top
    ctx.lineTo(150, 290); // right-angle corner
    ctx.lineTo(330, 290); // base corner
    ctx.closePath();      // hypotenuse back
    ctx.stroke();

    // Right-angle square indicator box
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.8;
    ctx.strokeRect(150, 275, 15, 15);

    // Side text labels
    ctx.fillStyle = "#1E293B";
    ctx.font = "20px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("a = 5 cm", 80, 235); // side height
    ctx.fillText("b = 12 cm", 200, 320); // side base
    ctx.fillStyle = "#EF4444"; // Highlight target unknown c side
    ctx.fillText("c = ?", 265, 215); // side hypotenuse

  } else if (id === "integral") {
    ctx.font = "bold 21px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Problem 4: Compute definite integral", 90, 130);

    // Definite integral equation with large integral symbol
    ctx.font = "34px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("∫", 125, 215);
    ctx.font = "14px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("3", 143, 185); // upper bound
    ctx.fillText("1", 135, 235); // lower bound

    ctx.font = "32px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("(3x² + 2x) dx", 160, 215);

    ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
    ctx.font = "italic 18px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("Fundamental Theorem of Calculus:", 130, 280);
    ctx.fillText("∫ f(x)dx = F(3) - F(1)", 130, 315);
  }

  // Draw some realistic paper coffee stain rings or binder holes circles! (Awesome immersive craft highlights)
  ctx.strokeStyle = "rgba(15, 23, 42, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(35, 100, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(35, 200, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(35, 300, 12, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toDataURL("image/png");
}
