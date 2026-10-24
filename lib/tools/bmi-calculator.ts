import { Tool } from "../types";

export const bmiCalculator: Tool = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  category: "Health",
  icon: "⚖️",
  shortDescription: "Calculate Body Mass Index from height and weight (metric or imperial).",
  description:
    "Compute your BMI and see which WHO category it falls into: underweight, normal, overweight, or obese. Supports both metric and imperial units.",
  keywords: ["bmi calculator", "body mass index", "bmi chart", "bmi formula"],
  fields: [
    {
      id: "units",
      label: "Units",
      type: "select",
      defaultValue: "metric",
      options: [
        { value: "metric", label: "Metric (kg, cm)" },
        { value: "imperial", label: "Imperial (lb, inches)" },
      ],
    },
    { id: "weight", label: "Weight (kg or lb)", type: "number", defaultValue: 70 },
    { id: "height", label: "Height (cm or inches)", type: "number", defaultValue: 175 },
  ],
  run: (v) => {
    const units = String(v.units || "metric");
    let w = Number(v.weight || 0);
    let h = Number(v.height || 0);
    if (w <= 0 || h <= 0) throw new Error("Weight and height must be positive.");

    let heightM: number;
    if (units === "imperial") {
      w = w * 0.453592;
      h = h * 2.54;
    }
    heightM = h / 100;

    const bmi = w / (heightM * heightM);
    const rounded = bmi.toFixed(1);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else if (bmi < 35) category = "Obese Class I";
    else if (bmi < 40) category = "Obese Class II";
    else category = "Obese Class III";

    return `BMI: ${rounded}\nCategory: ${category}\n\nWHO ranges:\n  Underweight: < 18.5\n  Normal: 18.5 – 24.9\n  Overweight: 25 – 29.9\n  Obese: ≥ 30`;
  },
  howTo: [
    "Select units (metric or imperial).",
    "Enter your weight and height.",
    "Click Calculate.",
  ],
  faqs: [
    { q: "Is BMI accurate for athletes?", a: "No — BMI doesn't distinguish muscle from fat. Very muscular people often register as overweight." },
    { q: "Is BMI valid for children?", a: "No — children use age- and sex-specific BMI percentiles. This tool is for adults only." },
  ],
};