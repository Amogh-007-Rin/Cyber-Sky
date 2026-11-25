import { useTerminalDimensions } from "@opentui/react";
import type { TextareaRenderable } from "@opentui/core";
import { useEffect, useRef, useState } from "react";
import CommandSuggestions from "../commands/CommandSuggestions";
import CurrentSelectionSpecbar from "../assets/CurrentSelectionSpecbar";

// 1. Maintain your custom typing format definition
type TextAreaHeight = number | "auto" | `${number}%` | undefined;
type TextAreaWidth = number | "auto" | `${number}%` | undefined;

interface CustomTextAreaProps {
    onValueChange?: (value: string) => void;
    onSubmit?: (value: string) => boolean;
    onCommandSelect?: (command: string) => boolean;
    onReady?: (textarea: TextareaRenderable) => void;
}

interface ContentChangeEmitter {
    addListener(event: "content-changed", listener: () => void): void;
    removeListener(event: "content-changed", listener: () => void): void;
}

export default function CustomTextArea({ onValueChange, onSubmit, onCommandSelect, onReady }: CustomTextAreaProps) {
    // 2. Call the dimensions hook inside the functional component layout root
    const { width, height } = useTerminalDimensions();
    const textareaRef = useRef<TextareaRenderable | null>(null);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (textareaRef.current) onReady?.(textareaRef.current);
    }, [onReady]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const handleContentChange = () => {
            const nextValue = textarea.plainText;
            setValue(nextValue);
            onValueChange?.(nextValue);
        };
        const contentEmitter = textarea.editBuffer as unknown as ContentChangeEmitter;
        contentEmitter.addListener("content-changed", handleContentChange);

        return () => {
            contentEmitter.removeListener("content-changed", handleContentChange);
        };
    }, [onValueChange]);

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
                height: getResponsiveTextAreaHeight(),
                backgroundColor: "#222222",
                position: "relative",
                paddingTop: 1,
                paddingLeft: 2,
                paddingRight: 2,
                gap: 1,
                overflow: "visible"
            }}
        >
            <textarea
                ref={textareaRef}
                id="input-text-area"
                placeholder="Ask the agent"
                keyBindings={[{ name: "return", action: "submit" }]}
                onSubmit={() => {
                    if (onSubmit?.(value)) {
                        textareaRef.current?.editBuffer.clear();
                        setValue("");
                    }
                }}
                style={{ width: "100%", height: "100%"}}
            >
            </textarea>
            <CommandSuggestions
                value={value}
                onSelect={(command) => {
                    if (onCommandSelect?.(command)) {
                        textareaRef.current?.editBuffer.clear();
                        setValue("");
                        return true;
                    }
                    return false;
                }}
            />
            <CurrentSelectionSpecbar/>
        </box>
    );
}
