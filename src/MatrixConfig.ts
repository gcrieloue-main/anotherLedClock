export class MatrixConfig {
  public primaryColor = 0xffffff;
  public secondaryColor = 0x3333ff;
  public brightness = 30;

  public config = () => {
    return {
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      brightness: this.brightness,
    };
  };
}
