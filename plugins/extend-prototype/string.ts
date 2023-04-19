export {};
declare global {
  interface String {
    /**
     * 首字大寫
     */
    toCapitalize(): string;
    /**
     * 全轉小寫後首字大寫
     */
    toLCCapitalize(): string;
  }
}
String.prototype.toCapitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.toLCCapitalize = function () {
  return this.toLowerCase().toCapitalize();
};
