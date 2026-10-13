// components/buttons/NewButton.tsx
import type { AlignString, JustifyString } from "@opentui/core";
import type { ReactNode } from "react";

interface NewButtonProps {
  children?: ReactNode; // Made children optional since you call it as <NewButton /> empty
  onClick?: () => void;
  justifyContent?: JustifyString | undefined;
  alignItems?: AlignString | undefined;
}

// React component names MUST start with a Capital letter (NewButton, not newButton)
export default function NewButton({ 
  children, 
  onClick, 
  justifyContent = "center", 
  alignItems = "center" 
}: NewButtonProps) {
  return (
    <box
      onMouseDown={() => {
        if (onClick) onClick();
      }}
      style={{
        border: true,
        borderStyle: "single",
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: "blue",
        justifyContent,
        alignItems,
      }}
    >
      {children}
    </box>
  );
}
