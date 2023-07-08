export class MatrixConfig {
  public primaryColor = 0xffffff;
  public secondaryColor = 0x92a8d1;
  public alternateColor = 0x92a8d1;
  public brightness = 100;

  public config = () => {
    return {
      primaryColor: this.primaryColor.toString(16),
      secondaryColor: this.secondaryColor.toString(16),
      alternateColor: this.alternateColor.toString(16),
      brightness: this.brightness,
    };
  };
}
