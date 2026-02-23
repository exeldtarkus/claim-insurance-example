import {
  getFieldMapBySegment,
  SupportedSegment,
} from "@/lib/etlerr.slik.ojk.error.field.mapping";
import type {
  FieldMap,
} from "@/lib/etlerr.slik.ojk.error.field.mapping";

export function etlErrTextToJson(
  inputText: string,
  segment: SupportedSegment
): FieldMap<string>[] | "BROKEN_FILE" {
  const lines = inputText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines[0]?.startsWith("ERROR ROW") || !lines[lines.length - 1]?.startsWith("END ERROR ROW")) {
    return "BROKEN_FILE";
  }

  const records: FieldMap<string>[] = [];
  let currentRecord: Partial<FieldMap<string>> | null = null;
  let insideErrorBlock = false;

  const schema = getFieldMapBySegment(segment);

  for (const line of lines) {
    if (line.startsWith("ERROR ROW")) {
      insideErrorBlock = true;
      continue;
    }

    if (line.startsWith("END ERROR ROW")) {
      insideErrorBlock = false;
      continue;
    }

    if (!insideErrorBlock) continue;

    if (line.startsWith("RECORD|")) {
      const parts = line.split("|").slice(2);
      currentRecord = {};

      schema.forEach((key, idx) => {
        currentRecord![key] = parts[idx] ?? null;
      });
    } else if (line.startsWith("ERROR|") && currentRecord) {
      const [, code, ...messageParts] = line.split("|");
      currentRecord.Error_Code = code;
      currentRecord.Error_Message = messageParts.join("|").trim();
      records.push(currentRecord as FieldMap<string>);
      currentRecord = null;
    }
  }

  return records;
}
