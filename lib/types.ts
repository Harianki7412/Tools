export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "color"
  | "file";

export interface ToolField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  description?: string;
  /** File input ke liye: accept attribute (jaise "application/pdf" ya "image/*") */
  accept?: string;
  /** File input ke liye: multiple files allow karein */
  multiple?: boolean;
}

export interface TextOutput {
  kind: "text";
  content: string;
}

export interface FileOutput {
  kind: "file";
  blob: Blob;
  filename: string;
  mimeType: string;
  note?: string;
}

export type ToolOutput = TextOutput | FileOutput;

/** run() string, ToolOutput, ya inka Promise return kar sakta hai */
export type ToolRunResult = string | ToolOutput;
export type ToolRunFn = (
  values: Record<string, any>
) => ToolRunResult | Promise<ToolRunResult>;

export interface ToolMetadata {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  keywords: string[];
  icon: string;
  fields: ToolField[];
  howTo: string[];
  faqs: { q: string; a: string }[];
}

export interface Tool extends ToolMetadata {
  run: ToolRunFn;
}