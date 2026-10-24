import { Tool } from "./types";
import { jsonFormatter } from "./tools/json-formatter";
import { base64 } from "./tools/base64";
import { ageCalculator } from "./tools/age-calculator";
import { textCase } from "./tools/text-case";
import { wordCounter } from "./tools/word-counter";
import { passwordGenerator } from "./tools/password-generator";
import { uuidGenerator } from "./tools/uuid-generator";
import { colorConverter } from "./tools/color-converter";
import { pdfCompressor } from "./tools/pdf-compressor";
import { imageConverter } from "./tools/image-converter";
import { imageCompressor } from "./tools/image-compressor";
import { pdfMerger } from "./tools/pdf-merger";
import { qrGenerator } from "./tools/qr-generator";
import { percentageCalculator } from "./tools/percentage-calculator";
import { bmiCalculator } from "./tools/bmi-calculator";
import { unixTimestamp } from "./tools/unix-timestamp";
import { hashGenerator } from "./tools/hash-generator";
import { emiCalculator } from "./tools/emi-calculator";
import { textDiff } from "./tools/text-diff";
import { cronGenerator } from "./tools/cron-generator";

export const TOOLS: Tool[] = [
  jsonFormatter,
  base64,
  uuidGenerator,
  ageCalculator,
  textCase,
  wordCounter,
  passwordGenerator,
  colorConverter,
  pdfCompressor,
  pdfMerger,
  imageConverter,
  imageCompressor,
  qrGenerator,
  percentageCalculator,
  bmiCalculator,
  unixTimestamp,
  hashGenerator,
  emiCalculator,
  textDiff,
  cronGenerator,
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}