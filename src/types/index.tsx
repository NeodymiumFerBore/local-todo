// https://stackoverflow.com/a/37144720
export class GUID {
  private readonly str: string;
  static readonly validPattern: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  constructor(str?: string) {
    if (str === undefined) {
      this.str = crypto.randomUUID();
    } else {
      if (GUID.validate(str)) this.str = str;
      else throw new Error("String '" + str + "' is not a valid GUID");
    }
    console.log(this.str);
  }

  toString() {
    return this.str;
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
