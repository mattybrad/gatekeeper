class AppComponent {
  static linearToDecibels(linear) {
    // https://sound.stackexchange.com/questions/38722/convert-db-value-to-linear-scale
    return 20 * Math.log10(linear);
  }
}

export default AppComponent;
