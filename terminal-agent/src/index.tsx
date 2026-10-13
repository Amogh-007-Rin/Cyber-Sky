import { createCliRenderer } from "@opentui/core";
import { createRoot, useTerminalDimensions } from "@opentui/react";
import CustomTextArea from "./components/textarea/customTextarea";
import LogoAsciiComponent from "./components/assets/LogoComponent";

function App() {

  let { width, height } = useTerminalDimensions();

  return (
    <box style={{ width: width, height: height, backgroundColor: "black", margin: 0, justifyContent: "center", alignItems: "center", gap: 3 }}>
      <box style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexShrink: 0, overflow: "hidden"}}>
        <LogoAsciiComponent />
      </box>
      <CustomTextArea />
    </box>
  )
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />)
