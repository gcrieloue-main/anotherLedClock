"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixConfig = void 0;
class MatrixConfig {
  primaryColor = 0xffffff;
  secondaryColor = 0x3333ff;
  alternateColor = 0x1111dd;
  brightness = 30;
  config = () => {
    return {
      primaryColor: this.primaryColor.toString(16),
      secondaryColor: this.secondaryColor.toString(16),
      alternateColor: this.alternateColor.toString(16),
      brightness: this.brightness,
    };
  };
}
exports.MatrixConfig = MatrixConfig;
