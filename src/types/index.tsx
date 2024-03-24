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
  }

  toString() {
    return this.str;
  }

  public static validate(guid: string): boolean {
    return GUID.validPattern.test(guid);
  }
}

export type TTodoItem = {
  id: GUID;
  title: string;
  description: string;
  done: boolean;
};

export type TTodoList = {
  id: GUID;
  title: string;
  description: string;
  items: TTodoItem[];
};

import type { DraggableId, DraggableLocation } from "@hello-pangea/dnd";

export type Id = string;

export interface AuthorColors {
  soft: string;
  hard: string;
}

export interface Author {
  id: Id;
  name: string;
  avatarUrl: string;
  url: string;
  colors: AuthorColors;
}

export interface Quote {
  id: Id;
  content: string;
  author: Author;
}

export interface Dragging {
  id: DraggableId;
  location: DraggableLocation;
}

export interface QuoteMap {
  [key: string]: Quote[];
}

export interface Task {
  id: Id;
  content: string;
}
