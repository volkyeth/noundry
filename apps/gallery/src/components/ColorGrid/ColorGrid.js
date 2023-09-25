import React, { Component } from "react";

class ColorGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: props.colors || [],
      copiedColor: null, // Initialize copiedColor as null
    };
  }

  copyToClipboard(color) {
    // Copy the color value to the clipboard
    navigator.clipboard.writeText(color);

    // Set the copiedColor state to the copied color value
    this.setState({ copiedColor: color });

    // Clear the copiedColor state after a few seconds
    setTimeout(() => {
      this.setState({ copiedColor: null });
    }, 1000); // Adjust the time as needed (2 seconds in this example)
  }

  render() {
    const { colors, copiedColor } = this.state;

    // Determine the text color based on copiedColor
    const textColor =
      copiedColor === "000000" ||
      copiedColor === "1f1d29" ||
      copiedColor === "2b2834"
        ? "#FFFFFF"
        : `#${copiedColor}`;

    return (
      <div className="color-grid-container">
        {copiedColor && (
          <div className="color-modal" style={{ color: textColor }}>
            #{copiedColor.toUpperCase()} copied to clipboard
          </div>
        )}

        <div className="color-grid">
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-square"
              style={{ backgroundColor: `#${color}` }}
              onClick={() => this.copyToClipboard(color)}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}

export default ColorGrid;
