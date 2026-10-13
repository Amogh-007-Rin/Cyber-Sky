import { useTerminalDimensions } from "@opentui/react";

// 1. Maintain your custom typing format definition
type TextAreaHeight = number | "auto" | `${number}%` | undefined;
type TextAreaWidth = number | "auto" | `${number}%` | undefined;

export default function CustomTextArea() {
    // 2. Call the dimensions hook inside the functional component layout root
    const { width, height } = useTerminalDimensions();

    // 3. Define the switch helper directly inside the component scope
    const getResponsiveTextAreaHeight = (): TextAreaHeight => {
        switch (true) {
            case height >= 35:
                return "12%";
            case height >= 25:
                return "20%";
            case height >= 20:
                return "20%"
            case height >= 15:
                return "30%"
            case height >= 10:
                return "20%"
            case height >= 5:
                return "20%"
        }
    };

    const getResponsiveTextAreaWidth = (): TextAreaWidth => {
        switch (true) {

            case width >= 140:
                return "50%";
            case width >= 130:
                return "60%";
            case width >= 120:
                return "65%";
            case width >= 100:
                return "75%";
            case width >= 90:
                return "85%";
            case width >= 80:
                return "85%";
            case width >= 70:
                return "85%";
            default:
                return "70%";
        }

    }

    return (
        <box
            style={{
                width: getResponsiveTextAreaWidth(),
                // 4. Bind the height property to the responsive calculation engine
                height: getResponsiveTextAreaHeight(),
                backgroundColor: "#222222",
                paddingLeft: 2,
                paddingRight: 2,
                overflow: "hidden"
            }}
        >
            <textarea
                id="input-text-area"
                placeholder="Ask the agent"
                style={{ width: "100%", height: "100%",
                    backgroundColor: "red"
                }}
            >
            </textarea>
            <box
                style={{
                    width: "100%",
                    backgroundColor: "blue",
                    height: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <text>Build</text>
                <text>claude Fable 5.1</text>
                <text>cyber sky</text>
            </box>
        </box>
    );
}
