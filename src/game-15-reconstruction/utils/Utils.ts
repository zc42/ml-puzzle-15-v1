// import * as fs from 'fs';

export class Utils {
  private static emptyString = '                                           ';

  public static prnt(o: any): void {
    console.log(o);
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

  // public static writeTextToFile(fileName: string, content: string): void {
  //   try {
  //     fs.writeFileSync(fileName, content, 'utf8');
  //   } catch (error) {
  //     console.error('Error writing to file:', error);
  //   }
  // }

  // public static _prnt(o: any): void {
  //   process.stdout.write(String(o));
  // }



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
}

// Helper type for collections (similar to Java's Collection interface)
type Collection<T> = Iterable<T> | ArrayLike<T>;
