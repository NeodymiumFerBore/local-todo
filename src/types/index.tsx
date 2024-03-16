// https://stackoverflow.com/a/37144720
export class GUID {
  private readonly str: string;
  static readonly validPattern: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  constructor(str?: string) {
    if (str === undefined) {
      this.str = GUID.generate();
    } else {
      if (GUID.validate(str)) this.str = str;
      else throw new Error("String '" + str + "' is not a valid GUID");
    }
  }

  toString() {
    return this.str;
  }

  private static generate(): string {
    // your favourite guid generation function could go here
    // ex: http://stackoverflow.com/a/8809472/188246
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  public static validate(guid: string): boolean {
    return GUID.validPattern.test(guid);
  }
}

export type TodoItem = {
  id: GUID;
  title: string;
  description: string;
  status: string;
};

export type TodoList = {
  id: GUID;
  title: string;
  description: string;
  items: TodoItem[];
};
