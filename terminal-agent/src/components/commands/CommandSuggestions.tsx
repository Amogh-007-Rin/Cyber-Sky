import { useKeyboard } from "@opentui/react";
import { useEffect, useState } from "react";

const commands = [
  ["/models", "Switch model"],
  ["/move", "Move to another project dir"],
  ["/mcps", "Toggle MCPs"],
  ["/variants", "Switch model variant"],
  ["/init", "guided AGENTS.md setup"],
  ["/themes", "Switch theme"],
  ["/sessions", "Switch session"],
  ["/review", "review changes [commit|branch|pr], defaults to uncommitted"],
] as const;

interface CommandSuggestionsProps {
  value: string;
  onSelect?: (command: string) => boolean;
}

export default function CommandSuggestions({ value, onSelect }: CommandSuggestionsProps) {
  const query = value.slice(1).toLowerCase();
  const filteredCommands = commands.filter(([command]) =>
    command.slice(1).startsWith(query),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [value]);

  useKeyboard((key) => {
    if (!value.startsWith("/") || filteredCommands.length === 0) return;

    if (key.name === "up") {
      setSelectedIndex((index) =>
        index === 0 ? filteredCommands.length - 1 : index - 1,
      );
    } else if (key.name === "down") {
      setSelectedIndex((index) => (index + 1) % filteredCommands.length);
    } else if (key.name === "return" || key.name === "enter") {
      const selectedCommand = filteredCommands[selectedIndex];
      if (selectedCommand) onSelect?.(selectedCommand[0]);
    }
  });

  if (!value.startsWith("/") || filteredCommands.length === 0) return null;

  return (
    <box
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        width: "100%",
        height: "auto",
        backgroundColor: "#1c1c1c",
        paddingX: 1,
        paddingY: 1,
        zIndex: 10,
      }}
    >
      {filteredCommands.map(([command, description], index) => (
        <box
          key={command}
          style={{
            width: "100%",
            height: 1,
            flexDirection: "row",
            backgroundColor: index === selectedIndex ? "#e7a176" : "#1c1c1c",
            paddingX: 1,
          }}
        >
          <text style={{ fg: index === selectedIndex ? "black" : "#dddddd", width: 14 }}>
            {command}
          </text>
          <text style={{ fg: index === selectedIndex ? "black" : "#777777" }}>
            {description}
          </text>
        </box>
      ))}
    </box>
  );
}
