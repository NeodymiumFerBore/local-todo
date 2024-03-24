import { colors } from "@mui/joy";
import { purple } from "@mui/material/colors";
import seedrandom from "seedrandom";
import {
  GUID,
  type Author,
  type Quote,
  type QuoteMap,
  type TTodoList,
  TTodoItem,
} from "../types";

const list1: Author = {
  id: "44114432-bd0b-42a7-b241-99b41cf2284f",
  name: "List 1",
  description: "My list 1",
};

const list2: Author = {
  id: "e48a836c-3813-4d00-b5a8-6c7f4d4f1db2",
  name: "List 2",
  description: "My list 2",
};

const list3: Author = {
  id: "93284ea7-3c76-4d80-92ec-d8f70b1dfa40",
  name: "List 3",
  description: "My list 3",
};

const list4: Author = {
  id: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  name: "List 4",
  description: "My list 4",
};

export const authors: Author[] = [list1, list2, list3, list4];

export const quotes: Quote[] = [
  {
    id: "7343fe89-5119-4248-b5d3-59bcf13d0ed5",
    content: "Sometimes life is scary and dark",
    author: list2,
  },
  {
    id: "34954a8a-8d75-4e72-bdb1-6dee4c5a2817",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
    author: list1,
  },
  {
    id: "1bd70895-7a61-4339-9a5e-a69c319b56f2",
    content: "You got to focus on what's real, man",
    author: list1,
  },
  {
    id: "bd38f61b-0d8b-47f6-a227-47129642515d",
    content: "Is that where creativity comes from? From sad biz?",
    author: list3,
  },
  {
    id: "d536c1fe-d778-4f26-b2d1-d8ae9c8db638",
    content: "Homies help homies. Always",
    author: list3,
  },
  {
    id: "f741ae06-3c46-485a-8db7-9efef3a77b93",
    content: "Responsibility demands sacrifice",
    author: list4,
  },
  {
    id: "f2e75823-e3f6-4e45-b43c-8c98d0bb3447",
    content: "That's it! The answer was so simple, I was too smart to see it!",
    author: list4,
  },
  {
    id: "c4488a6b-eea9-499b-aa72-e0910926d0f4",
    content:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
    author: list3,
  },
  {
    id: "e43229b9-3451-4840-a163-43dd34736ad3",
    content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
    author: list3,
  },
  {
    id: "857b4c32-b515-4ea2-8841-94a158d3fd4e",
    content: "I should not have drunk that much tea!",
    author: list4,
  },
  {
    id: "4c46eae3-f8c4-4ab4-aaa0-363b5890d34c",
    content: "Please! I need the real you!",
    author: list4,
  },
  {
    id: "7e64f189-e70a-4ee0-846e-a4d7782280ee",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    author: list4,
  },
];

// So we do not have any clashes with our hardcoded ones
let idCount: number;
let predictableMathRandom: seedrandom.PRNG;

export const resetData = (seed: string) => {
  idCount = 1;
  predictableMathRandom = seedrandom(seed);
};

resetData("base");

export const getQuotes = (count: number = quotes.length): Quote[] =>
  // eslint-disable-next-line no-restricted-syntax
  Array.from({ length: count }, (_, k) => k).map(() => {
    const random: Quote =
      quotes[Math.floor(predictableMathRandom() * quotes.length)];

    const custom: Quote = {
      ...random,
      id: `G${idCount++}`,
    };

    return custom;
  });

export const generateQuoteMap = (quoteCount: number): QuoteMap =>
  authors.reduce(
    (previous: QuoteMap, author: Author) => ({
      ...previous,
      [author.name]: getQuotes(quoteCount / authors.length),
    }),
    {}
  );

/****************************************************/

export function generateTodoList(
  title: string = "",
  desc: string = ""
): TTodoList {
  return {
    id: new GUID(),
    title: title || "List 1",
    description: desc || "My list",
  };
}

export function generateTodoLists(listCount: number = 3): TTodoList[] {
  return Array.from({ length: listCount }, (_, k) => k).map(() => {
    return generateTodoList();
  });
}

export function generateTodoItems(count: number, listId: GUID): TTodoItem[] {
  return Array.from({ length: count }, (_, k) => k).map(() => {
    return {
      id: new GUID(),
      listId: new GUID(listId.str),
      content:
        quotes[Math.floor(predictableMathRandom() * quotes.length)].content,
      done: false,
    };
  });
}

// export function generateTodoListMap(
//   lists: TTodoList[],
//   todoItems: TTodoItem[]
// ): QuoteMap {
//   lists.reduce((previous: QuoteMap, listId: GUID) => ({
//     ...previous,
//     [listId.str]: todoItems.filter((e) => e.listId.str === listId.str),
//   }));
// }
