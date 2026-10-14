import { createCliRenderer } from "@opentui/core";
import { createRoot, useTerminalDimensions } from "@opentui/react";
import CustomTextArea from "./components/textarea/customTextarea";
import LogoAsciiComponent from "./components/assets/LogoComponent";
import ModelSelectionPannel from "./components/buttons/ModelSelectionPannel";
import { useState } from "react";


function App() {
  let { width, height } = useTerminalDimensions();
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(true);

  return (
    <box style={{ width: width, height: height, backgroundColor: "black", margin: 0,  justifyContent: "center", alignItems: "center", gap: 3 }}>
       {/* <box style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexShrink: 0, overflow: "hidden"}}>
         <LogoAsciiComponent />
       </box>
     <CustomTextArea /> */}
    {isModelPanelOpen && (
      <ModelSelectionPannel onClose={() => setIsModelPanelOpen(false)} />
    )}
    </box>
    
  )
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />); 
