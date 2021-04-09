export class Formatter {
  /**
   * 除去字符串中的空格，包括串首、串中、串尾
   * @param str
   * @returns
   */
  static removeBlanks(str: string): string {
    return str.replace(/\s+/g, '');
  }

  static removeEnter(str: string): string{
    return str.replace(/\n+/g, '');
  }
}
