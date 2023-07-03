"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrix = void 0;
const rpi_led_matrix_1 = require("rpi-led-matrix");
exports.matrix = new rpi_led_matrix_1.LedMatrix(
  {
    ...rpi_led_matrix_1.LedMatrix.defaultMatrixOptions(),
    rows: 16,
    cols: 32,
    chainLength: 1,
    hardwareMapping: rpi_led_matrix_1.GpioMapping.Regular,
    pixelMapperConfig: rpi_led_matrix_1.LedMatrixUtils.encodeMappers({
      type: rpi_led_matrix_1.PixelMapperType.U,
    }),
    pwmBits: 11,
    pwmLsbNanoseconds: 200, //default 130
  },
  {
    ...rpi_led_matrix_1.LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 1,
  }
);
