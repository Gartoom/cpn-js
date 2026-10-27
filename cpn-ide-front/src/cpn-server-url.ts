export class CpnServerUrl {
  // static url = '';
  static url = window.location.origin;

  static set(url) {
    this.url = url;
  }

  static get() {
    return this.url;
  }
}
