import type { DraggableId, DraggableLocation } from "@hello-pangea/dnd";

// https://stackoverflow.com/a/37144720
export class GUID {
  public readonly str: string;
  static readonly validPattern: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  constructor(str?: string) {
    if (str === undefined) {
      this.str = crypto.randomUUID();
    } else {
      if (GUID.validate(str)) this.str = str;
      else throw new Error("String '" + str + "' is not a valid GUID");
    }
  }

  public static validate(guid: string): boolean {
    return GUID.validPattern.test(guid);
  }
}

export type TTodoItem = {
  id: GUID;
  listId: GUID;
  content: string;
  done: boolean;
};

export type TTodoList = {
  id: GUID;
  title: string;
  description: string;
};

export type TodoListMap = {
  [key: string]: TTodoList;
};

// export type Id = string;

// export interface AuthorColors {
//   soft: string;
//   hard: string;
// }

// export interface Author {
//   id: Id;
//   name: string;
//   url: string;
//   colors: AuthorColors;
// }

// export interface Quote {
//   id: Id;
//   content: string;
//   author: Author;
// }

export interface Dragging {
  id: DraggableId;
  location: DraggableLocation;
}

// export interface QuoteMap {
//   [key: string]: Quote[];
// }
