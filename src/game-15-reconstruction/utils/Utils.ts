import { ConsoleUtils } from './ConsoleUtils';

export class Utils {
  private static emptyString = '                                           ';

  public static prnt(o: any, color = 'color: black;'): void {
    ConsoleUtils.prnt(o, color);
  }

  public static str(o: any, len: number): string {
    const v = o.toString();
    if (v.length >= len) return v;
    const i = len - v.length;
    return v + Utils.emptyString.substring(0, i);
  }

  public static sum(l: number[]): number {
    if (!l) {
      return 0;
    }

    // Filter out zeros
    l = l.filter(e => e !== 0);

    if (l.length === 0) {
      return 0;
    }

    // Use reduce to sum the list elements
    return l.reduce((acc, curr) => acc + curr, 0);
  }

  public static toString<T>(list: Collection<T>): string {
    const collect = Array.from(list).map(String).join(', ');
    return `[${collect}]`;
  }

  public static px<T>(): (t: T, u: T) => T {
    return (t: T, _: T) => t;
  }

  public static equalArrays<T>(array: T[], array2: T[]): boolean {
    // First, check if the lengths of both arrays are equal
    if (array.length !== array2.length) {
      return false; // Not equal if lengths differ
    }

    // Then, check each corresponding element for equality
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== array2[i]) {
        return false; // Return false if any action is different
      }
    }

    return true; // Arrays are equal if all checks passed
  }

  public static shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  private static _sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static async sleep(ms: number) {
    // Utils.prnt('Start');
    await this._sleep(ms); // Pauses for 2 seconds
    // Utils.prnt('End after 2 seconds');
  }



  // public static _sleep(ms: number): Promise<void> {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // public static async sleep(ms: number) {
  //   Utils.prnt('Start');
  //   this._sleep(ms).then(() => {
  //     Utils.prnt('End after 2 seconds');
  //   });
  // }
}

// Helper type for collections (similar to Java's Collection interface)
type Collection<T> = Iterable<T> | ArrayLike<T>;
