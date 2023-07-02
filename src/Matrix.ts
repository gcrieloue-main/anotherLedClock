import {
  LedMatrix,
  GpioMapping,
  LedMatrixUtils,
  PixelMapperType,
} from "rpi-led-matrix";

export const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 16,
    cols: 32,
    chainLength: 1,
    hardwareMapping: GpioMapping.Regular,
    pixelMapperConfig: LedMatrixUtils.encodeMappers({
      type: PixelMapperType.U,
    }),
    pwmBits: 8, //default 11
    pwmLsbNanoseconds: 300, //default 130
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 0,
  }
);
