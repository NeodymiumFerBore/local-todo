import { colors } from "@mui/joy";
import { purple } from "@mui/material/colors";
import seedrandom from "seedrandom";
import {
  GUID,
  type Author,
  type Quote,
  type QuoteMap,
  type TTodoList,
  type TTodoItem,
  TodoListMap,
} from "../types";

const jake: Author = {
  id: "1",
  name: "Jake",
  url: "http://adventuretime.wikia.com/wiki/Jake",
  colors: {
    soft: colors.yellow[50],
    hard: colors.yellow[800],
  },
};

const BMO: Author = {
  id: "2",
  name: "BMO",
  url: "http://adventuretime.wikia.com/wiki/BMO",
  colors: {
    soft: colors.green[50],
    hard: colors.green[800],
  },
};

const finn: Author = {
  id: "3",
  name: "Finn",
  url: "http://adventuretime.wikia.com/wiki/Finn",
  colors: {
    soft: colors.blue[50],
    hard: colors.blue[800],
  },
};

const princess: Author = {
  id: "4",
  name: "Princess bubblegum",
  url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
  colors: {
    soft: purple[50],
    hard: purple[800],
  },
};

export const authors: Author[] = [jake, BMO, finn, princess];

export const quotes: Quote[] = [
  {
    id: "1",
    content: "Sometimes life is scary and dark",
    author: BMO,
  },
  {
    id: "2",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
    author: jake,
  },
  {
    id: "3",
    content: "You got to focus on what's real, man",
    author: jake,
  },
  {
    id: "4",
    content: "Is that where creativity comes from? From sad biz?",
    author: finn,
  },
  {
    id: "5",
    content: "Homies help homies. Always",
    author: finn,
  },
  {
    id: "6",
    content: "Responsibility demands sacrifice",
    author: princess,
  },
  {
    id: "7",
    content: "That's it! The answer was so simple, I was too smart to see it!",
    author: princess,
  },
  {
    id: "8",
    content:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
    author: finn,
  },
  {
    id: "9",
    content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
    author: finn,
  },
  {
    id: "10",
    content: "I should not have drunk that much tea!",
    author: princess,
  },
  {
    id: "11",
    content: "Please! I need the real you!",
    author: princess,
  },
  {
    id: "12",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    author: princess,
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

export function generateTodoLists(
  listCount: number = 3
  // todosCountMin: number = 5,
  // todosCountMax: number = 10
): TTodoList[] {
  return Array.from({ length: listCount }, (_, k) => k).map(() => {
    return generateTodoList();
  });
  // return Array.from({ length: listCount }, (_, k) => k).map((_, i) => {
  //   const c = Math.floor(
  //     Math.random() * (todosCountMax - todosCountMin + 1) + todosCountMin
  //   );
  //   return generateTodoList(c, `List`, `Description of list ${i + 1}`);
  // });
}

export function generateTodoListMap(lists: TTodoList[]): TodoListMap {
  const ids = Array.from(lists, (v, _) => v.id.str);
  return ids.reduce((map, id, i) => ({ ...map, [id]: lists[i] }), {});
}
