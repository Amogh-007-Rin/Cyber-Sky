import { BoxRenderable, type BoxOptions, type RenderContext } from "@opentui/core";
import { extend } from "@opentui/react";


// This is how we create a custom component 
class CustomButtonRenderable extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions) {
    super(ctx, {
      id: "customButton",
      width: 12,
      height: 3,
      border: true,
      backgroundColor: "#444",
      ...options,
    });

    this.onMouseDown = () => {
      console.log("Button clicked!");
    };
    this.onMouseOver = () => {
      this.backgroundColor = "#666";
    };
    this.onMouseOut = () => {
      this.backgroundColor = "#444";
    };
  }
}

declare module "@opentui/react" {
  interface OpenTUIComponents {
    customButton: typeof CustomButtonRenderable;
  }
}

extend({ customButton: CustomButtonRenderable });
