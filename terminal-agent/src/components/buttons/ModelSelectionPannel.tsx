import { useKeyboard } from "@opentui/react";
import type { InputRenderable, ScrollBoxRenderable } from "@opentui/core";
import { useEffect, useRef, useState } from "react";
import EscapeButton from "./EscapeButton";

const recentModels = [
  { name: "Muse Spark 1.3 Free", provider: "OpenCode" },
  { name: "DeepSeek V4 Pro (New)", provider: "OpenCode Go" },
  { name: "Nemotron 3.5 Lightning Free", provider: "OpenCode" },
  { name: "Qwen3.7 Plus", provider: "OpenCode Go" },
];

const openCodeModels = [
  "Cat Jam Free",
  "Exo Free",
  "Ling 3.1 Flash Free",
  "LongCat 2.5 Preview Free",
  "Space Bunny Free",
  "MiMo-V2.6-Flash Free",
  "Step 5 Preview Free",
  "Ling 3.0 Flash Fit Free",
  "Nemotron 3 Ultra Free",
  "Big Pickle",
  "Cat Jam Free",
  "Exo Free",
  "Ling 3.1 Flash Free",
  "LongCat 2.5 Preview Free",
  "Space Bunny Free",
  "MiMo-V2.6-Flash Free",
  "Step 5 Preview Free",
  "Ling 3.0 Flash Fit Free",
  "Nemotron 3 Ultra Free",
  "Big Pickle",
  "Cat Jam Free",
  "Exo Free",
  "Ling 3.1 Flash Free",
  "LongCat 2.5 Preview Free",
  "Space Bunny Free",
  "MiMo-V2.6-Flash Free",
  "Step 5 Preview Free",
  "Ling 3.0 Flash Fit Free",
  "Nemotron 3 Ultra Free",
  "Big Pickle",
].map((name) => ({ name, provider: "Free" }));

const selectableModels = [...recentModels, ...openCodeModels];
type Model = (typeof selectableModels)[number];

interface ModelSelectionPannelProps {
  onSelect?: (model: Model) => void;
  onClose?: () => void;
}

function ModelRow({
  model,
  selected,
  rowId,
}: {
  model: Model;
  selected: boolean;
  rowId: string;
}) {
  return (
    <box
      id={rowId}
      style={{
        width: "100%",
        height: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: selected ? "#e7a176" : "#121212",
        paddingX: 1,
      }}
    >
      <text style={{ fg: selected ? "black" : "#121212" }}>●</text>
      <text style={{ fg: selected ? "black" : "#dddddd" }}>
        {` ${model.name}`}
      </text>
      <box style={{ flexGrow: 1 }} />
      <text style={{ fg: selected ? "black" : "#666666" }}>
        {model.provider}
      </text>
    </box>
  );
}

function clampIndex(index: number, modelCount: number): number {
  return Math.max(0, Math.min(index, modelCount - 1));
}

export default function ModelSelectionPannel({
  onSelect,
  onClose,
}: ModelSelectionPannelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<InputRenderable | null>(null);
  const modelListRef = useRef<ScrollBoxRenderable | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (model: Model) =>
    model.name.toLowerCase().includes(normalizedQuery) ||
    model.provider.toLowerCase().includes(normalizedQuery);
  const filteredRecentModels = recentModels.filter(matchesQuery);
  const filteredOpenCodeModels = openCodeModels.filter(matchesQuery);
  const filteredModels = [...filteredRecentModels, ...filteredOpenCodeModels];

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedIndex < filteredRecentModels.length) {
      modelListRef.current?.scrollTo(0);
      return;
    }

    modelListRef.current?.scrollChildIntoView(`model-${selectedIndex}`);
  }, [filteredRecentModels.length, selectedIndex]);

  useKeyboard((key) => {
    if (key.name === "escape") {
      onClose?.();
    } else if (key.name === "up") {
      setSelectedIndex((index) => clampIndex(index - 1, filteredModels.length));
    } else if (key.name === "down") {
      setSelectedIndex((index) => clampIndex(index + 1, filteredModels.length));
    } else if (key.name === "return" || key.name === "enter") {
      const selectedModel = filteredModels[selectedIndex];
      if (selectedModel) onSelect?.(selectedModel);
    }
  });

  return (
    <box
      style={{
        height: "60%",
        width: "35%",
        backgroundColor: "#121212",
        paddingX: 5,
        paddingY: 2,
        gap: 1,
      }}
    >
      <box
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <text>Select model</text>
        <EscapeButton onPress={() => onClose?.()} />
      </box>
      <box style={{ height: 1 }}></box>
      <input
        ref={searchInputRef}
        placeholder="Search"
        onInput={(value) => setSearchQuery(value)}
        style={{
          width: "100%",
          focusedBackgroundColor: "#121212",
        }}
      />
      <scrollbox
        ref={modelListRef}
        verticalScrollbarOptions={{ visible: false }}
        style={{
          flexGrow: 1,
          width: "100%",
          backgroundColor: "#121212",
        }}
      >
        <box style={{ height: "auto", width: "100%" }}>
          {filteredRecentModels.length > 0 && (
            <box style={{ paddingX: 3 }}>
              <text style={{ fg: "#a56de2" }}>Recent</text>
            </box>
          )}

          {filteredRecentModels.map((model, index) => (
            <ModelRow
              key={`${model.name}-${index}`}
              rowId={`model-${index}`}
              model={model}
              selected={index === selectedIndex}
            />
          ))}
        </box>
        {filteredRecentModels.length > 0 && filteredOpenCodeModels.length > 0 && (
          <box style={{ height: 1 }}></box>
        )}
        <box style={{ height: "auto", width: "100%" }}>
          {filteredOpenCodeModels.length > 0 && (
            <>
              <box style={{ paddingX: 3 }}>
                <text style={{ fg: "#a56de2" }}>Opencode</text>
              </box>
              {filteredOpenCodeModels.map((model, index) => (
                <ModelRow
                  key={`${model.name}-${index}`}
                  rowId={`model-${index + filteredRecentModels.length}`}
                  model={model}
                  selected={
                    index + filteredRecentModels.length === selectedIndex
                  }
                />
              ))}
            </>
          )}
        </box>
        {filteredModels.length === 0 && (
          <box style={{ paddingX: 3 }}>
            <text style={{ fg: "#666666" }}>No models found</text>
          </box>
        )}
      </scrollbox>
      <box
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 1,
          marginTop: 2,
        }}
      >
        <text>Connect provider</text>
        <text style={{ fg: "#666666" }}>ctrl+a</text>
        <text>Favorite</text>
        <text style={{ fg: "#666666" }}>ctrl+f</text>
      </box>
    </box>
  );
}
