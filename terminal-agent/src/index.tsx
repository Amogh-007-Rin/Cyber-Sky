import { createCliRenderer } from "@opentui/core";
import type { TextareaRenderable } from "@opentui/core";
import { createRoot, useTerminalDimensions } from "@opentui/react";
import CustomTextArea from "./components/textarea/customTextarea";
import LogoAsciiComponent from "./components/assets/LogoComponent";
import ModelSelectionPannel from "./components/buttons/ModelSelectionPannel";
import { useEffect, useRef, useState } from "react";


function App() {
  let { width, height } = useTerminalDimensions();
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  const [modelPanelOpacity, setModelPanelOpacity] = useState(0);
  const textareaRef = useRef<TextareaRenderable | null>(null);

  useEffect(() => {
    if (!isModelPanelOpen) {
      setModelPanelOpacity(0);
      return;
    }

    let elapsed = 0;
    const duration = 180;
    const frameCallback = async (deltaTime: number) => {
      elapsed += deltaTime;
      const progress = Math.min(elapsed / duration, 1);
      setModelPanelOpacity(progress);

      if (progress === 1) {
        renderer.removeFrameCallback(frameCallback);
      }
    };

    renderer.setFrameCallback(frameCallback);
    return () => renderer.removeFrameCallback(frameCallback);
  }, [isModelPanelOpen]);

  useEffect(() => {
    if (!isModelPanelOpen) textareaRef.current?.focus();
  }, [isModelPanelOpen]);

  return (
    <box style={{ width: width, height: height, backgroundColor: "black", margin: 0, position: "relative", justifyContent: "center", alignItems: "center", gap: 3 }}>
       <box style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexShrink: 0, overflow: "hidden"}}>
         <LogoAsciiComponent />
       </box>
     <CustomTextArea
       onReady={(textarea) => {
         textareaRef.current = textarea;
       }}
       onCommandSelect={(command) => {
         if (command !== "/models") return false;
         setIsModelPanelOpen(true);
         return true;
       }}
       onSubmit={(value) => {
         if (value.trim() !== "/models") return false;
         setIsModelPanelOpen(true);
         return true;
       }}
     />
    {isModelPanelOpen && (
      <box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          opacity: modelPanelOpacity,
        }}
      >
        <ModelSelectionPannel onClose={() => setIsModelPanelOpen(false)} />
      </box>
    )}
    </box>

  )
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />);
