export class MatrixConfig {
  public primaryColor = 0xffffff;
  public secondaryColor = 0x3333ff;
  public alternateColor = 0x1111dd;
  public brightness = 80;

  public config = () => {
    return {
      primaryColor: this.primaryColor.toString(16),
      secondaryColor: this.secondaryColor.toString(16),
      alternateColor: this.alternateColor.toString(16),
      brightness: this.brightness,
    };
  };
}
