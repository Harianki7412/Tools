import { ToolRunFn } from "./types";
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

export const TOOL_LOGIC: Record<string, ToolRunFn> = {
  "json-formatter": jsonFormatter.run,
  "base64-encoder-decoder": base64.run,
  "age-calculator": ageCalculator.run,
  "text-case-converter": textCase.run,
  "word-counter": wordCounter.run,
  "password-generator": passwordGenerator.run,
  "uuid-generator": uuidGenerator.run,
  "color-converter": colorConverter.run,
  "pdf-compressor": pdfCompressor.run,
  "image-converter": imageConverter.run,
  "image-compressor": imageCompressor.run,
  "pdf-merger": pdfMerger.run,
  "qr-code-generator": qrGenerator.run,
  "percentage-calculator": percentageCalculator.run,
  "bmi-calculator": bmiCalculator.run,
  "unix-timestamp-converter": unixTimestamp.run,
  "hash-generator": hashGenerator.run,
  "emi-calculator": emiCalculator.run,
  "text-diff": textDiff.run,
  "cron-generator": cronGenerator.run,
};