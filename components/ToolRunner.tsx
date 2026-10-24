"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ToolMetadata,
  ToolOutput,
  FileOutput,
  ToolRunResult,
} from "@/lib/types";
import { TOOL_LOGIC } from "@/lib/tool-logic";

function toOutput(result: ToolRunResult): ToolOutput {
  if (typeof result === "string") return { kind: "text", content: result };
  return result;
}

function isFileOutput(o: ToolOutput): o is FileOutput {
  return o.kind === "file";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ToolRunner({
  toolMetadata,
}: {
  toolMetadata: ToolMetadata;
}) {
  // ✅ FIX: multiple file fields ka default [] hai
  const initial = useMemo(() => {
    const obj: Record<string, any> = {};
    toolMetadata.fields.forEach((f) => {
      if (f.type === "file") obj[f.id] = f.multiple ? [] : null;
      else obj[f.id] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    });
    return obj;
  }, [toolMetadata]);

  const [values, setValues] = useState<Record<string, any>>(initial);
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Object URL cleanup — memory leak se bachne ke liye
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const setField = (id: string, v: any) =>
    setValues((s) => ({ ...s, [id]: v }));

  // ✅ FIX: useMemo handleRun ke andar se hata diya
  const handleRun = async () => {
    try {
      setLoading(true);
      setError("");
      setOutput(null);
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      }

      const runner = TOOL_LOGIC[toolMetadata.slug];
      if (!runner) throw new Error("Tool logic not found.");

      const raw = await runner(values);
      const result = toOutput(raw);
      setOutput(result);

      if (isFileOutput(result)) {
        setDownloadUrl(URL.createObjectURL(result.blob));
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output || output.kind !== "text") return;
    try {
      await navigator.clipboard.writeText(output.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleReset = () => {
    setValues(initial);
    setOutput(null);
    setError("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid gap-4">
        {toolMetadata.fields.map((f) => (
          <div key={f.id}>
            <label
              htmlFor={f.id}
              className="mb-1 block text-sm font-medium text-gray-800"
            >
              {f.label}
            </label>

            {f.type === "textarea" && (
              <textarea
                id={f.id}
                value={values[f.id]}
                onChange={(e) => setField(f.id, e.target.value)}
                placeholder={f.placeholder}
                rows={6}
                className="w-full rounded-md border border-gray-300 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
            )}

            {f.type === "text" && (
              <input
                id={f.id}
                type="text"
                value={values[f.id]}
                onChange={(e) => setField(f.id, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            )}

            {f.type === "number" && (
              <input
                id={f.id}
                type="number"
                value={values[f.id]}
                onChange={(e) => setField(f.id, e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none md:w-48"
              />
            )}

            {f.type === "select" && (
              <select
                id={f.id}
                value={values[f.id]}
                onChange={(e) => setField(f.id, e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none md:w-64"
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}

            {f.type === "checkbox" && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  id={f.id}
                  type="checkbox"
                  checked={!!values[f.id]}
                  onChange={(e) => setField(f.id, e.target.checked)}
                  className="h-4 w-4"
                />
                Enable
              </label>
            )}

            {f.type === "color" && (
              <input
                id={f.id}
                type="color"
                value={values[f.id]}
                onChange={(e) => setField(f.id, e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-gray-300"
              />
            )}

            {f.type === "file" && (
              <div>
                <input
                  id={f.id}
                  type="file"
                  accept={f.accept}
                  multiple={f.multiple}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) {
                      setField(f.id, f.multiple ? [] : null);
                    } else if (f.multiple) {
                      setField(f.id, Array.from(files));
                    } else {
                      setField(f.id, files[0]);
                    }
                  }}
                  className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-sm file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                />
                {f.multiple &&
                  Array.isArray(values[f.id]) &&
                  values[f.id].length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-gray-500">
                      {(values[f.id] as File[]).map((file, i) => (
                        <li key={i}>
                          {i + 1}. {file.name} ({formatBytes(file.size)})
                        </li>
                      ))}
                    </ul>
                  )}
                {!f.multiple && values[f.id] && (
                  <p className="mt-1 text-xs text-gray-500">
                    Selected: {(values[f.id] as File).name} (
                    {formatBytes((values[f.id] as File).size)})
                  </p>
                )}
              </div>
            )}

            {f.description && (
              <p className="mt-1 text-xs text-gray-500">{f.description}</p>
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing…" : `Run ${toolMetadata.name.split(" ")[0]}`}
          </button>
          <button
            onClick={handleReset}
            className="rounded-md border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {output && output.kind === "text" && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Output</span>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-gray-900 p-4 font-mono text-sm text-green-300">
              {output.content}
            </pre>
          </div>
        )}

        {output && output.kind === "file" && downloadUrl && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              ✅ Ready to download
            </p>
            {output.note && (
              <p className="mt-1 text-xs text-green-700">{output.note}</p>
            )}
            <a
              href={downloadUrl}
              download={output.filename}
              className="mt-3 inline-block rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
            >
              Download {output.filename}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
