import { Tool } from "../types";
import { asString } from "../utils";

export const ageCalculator: Tool = {
  slug: "age-calculator",
  name: "Age Calculator",
  category: "Calculators",
  icon: "🎂",
  shortDescription: "Calculate exact age in years, months, days, and next birthday.",
  description:
    "Enter your date of birth to compute exact age in years, months, and days, plus total days lived and days until your next birthday.",
  keywords: ["age calculator", "date of birth calculator", "how old am i", "days until birthday"],
  fields: [
    {
      id: "dob",
      label: "Date of Birth",
      type: "text",
      placeholder: "YYYY-MM-DD",
      defaultValue: "1995-06-15",
      description: "Format: YYYY-MM-DD",
    },
  ],
  run: (v) => {
    const dob = asString(v.dob);
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) throw new Error("Please enter a valid date (YYYY-MM-DD).");
    const today = new Date();
    if (birth > today) throw new Error("Date of birth cannot be in the future.");

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / 86_400_000);

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / 86_400_000);

    return [
      `Age: ${years} years, ${months} months, ${days} days`,
      `Total days lived: ${totalDays.toLocaleString()}`,
      `Next birthday: ${nextBirthday.toDateString()} (in ${daysToBirthday} days)`,
    ].join("\n");
  },
  howTo: [
    "Enter your date of birth as YYYY-MM-DD.",
    "Click Calculate Age.",
    "See exact age, total days lived, and days to next birthday.",
  ],
  faqs: [
    {
      q: "Does this account for leap years?",
      a: "Yes — the calculation uses real calendar math, so leap years are handled automatically.",
    },
  ],
};