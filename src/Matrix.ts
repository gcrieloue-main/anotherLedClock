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
    pwmBits: 11, //default 11
    pwmLsbNanoseconds: 130, //default 130
    showRefreshRate: true,
    limitRefreshRateHz: 250, // 0 for no limit rate
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 1,
  }
);
