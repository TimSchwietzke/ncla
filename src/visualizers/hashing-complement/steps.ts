import type { ArrayStep, CellTone } from "../core/types";

export interface ComplementInput {
  values: number[];
  target: number;
}

/**
 * Two Sum by complement lookup: for each value, ask the map whether target − value has
 * already been seen. The map is the whole point, so it rides along in the side panel.
 *
 * Pure and deterministic — every frame is precomputed (CLAUDE.md §9).
 */
export function buildSteps({ values, target }: ComplementInput): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const seen = new Map<number, number>();

  const panelOf = (highlight?: number) => ({
    label: "seen",
    emptyHint: "empty",
    entries: [...seen.entries()].map(([value, index]) => ({
      key: String(value),
      value: String(index),
      tone: (value === highlight ? "found" : "default") as CellTone,
    })),
  });

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index] ?? 0;
    const complement = target - value;
    const match = seen.get(complement);

    if (match !== undefined) {
      steps.push({
        caption: `${complement} is already in the map at index ${match}. ${complement} + ${value} = ${target}.`,
        values,
        tones: values.map((_, i) =>
          i === index || i === match ? "found" : ("dim" as CellTone),
        ),
        markers: [{ index, label: "i" }],
        readout: `answer [${match}, ${index}]`,
        panel: panelOf(complement),
      });
      return steps;
    }

    steps.push({
      caption: `Need ${complement} to reach ${target}. The map does not have it, so remember ${value}.`,
      values,
      tones: values.map((_, i) =>
        i === index ? "active" : i < index ? "default" : ("dim" as CellTone),
      ),
      markers: [{ index, label: "i" }],
      readout: `looking for ${complement}`,
      panel: panelOf(),
    });

    // Insert only after asking — that is what stops a value pairing with itself.
    seen.set(value, index);
  }

  steps.push({
    caption: `No pair adds up to ${target}.`,
    values,
    tones: values.map(() => "dim" as CellTone),
    markers: [],
    readout: "no pair found",
    panel: panelOf(),
  });

  return steps;
}
