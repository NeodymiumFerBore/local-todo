import { GUID } from "../types";
import type { Todo, TodoItemMap, TTodoList } from "../types";

const list1: TTodoList = {
  id: "44114432-bd0b-42a7-b241-99b41cf2284f",
  name: "List 1",
  description: "My list 1",
};

const list2: TTodoList = {
  id: "e48a836c-3813-4d00-b5a8-6c7f4d4f1db2",
  name: "List 2",
  description: "My list 2",
};

const list3: TTodoList = {
  id: "93284ea7-3c76-4d80-92ec-d8f70b1dfa40",
  name: "List 3",
  description: "My list 3",
};

const list4: TTodoList = {
  id: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  name: "List 4",
  description: "My list 4",
};

export const todoLists: TTodoList[] = [list1, list2, list3, list4];

export const todos: Todo[] = [
  {
    id: "34954a8a-8d75-4e72-bdb1-6dee4c5a2817",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
    todoList: "44114432-bd0b-42a7-b241-99b41cf2284f",
  },
  {
    id: "1bd70895-7a61-4339-9a5e-a69c319b56f2",
    content: "You got to focus on what's real, man",
    todoList: "44114432-bd0b-42a7-b241-99b41cf2284f",
  },
  {
    id: "7343fe89-5119-4248-b5d3-59bcf13d0ed5",
    content: "Sometimes life is scary and dark",
    todoList: "e48a836c-3813-4d00-b5a8-6c7f4d4f1db2",
  },
  {
    id: "bd38f61b-0d8b-47f6-a227-47129642515d",
    content: "Is that where creativity comes from? From sad biz?",
    todoList: "93284ea7-3c76-4d80-92ec-d8f70b1dfa40",
  },
  {
    id: "d536c1fe-d778-4f26-b2d1-d8ae9c8db638",
    content: "Homies help homies. Always",
    todoList: "93284ea7-3c76-4d80-92ec-d8f70b1dfa40",
  },
  {
    id: "c4488a6b-eea9-499b-aa72-e0910926d0f4",
    content:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
    todoList: "93284ea7-3c76-4d80-92ec-d8f70b1dfa40",
  },
  {
    id: "e43229b9-3451-4840-a163-43dd34736ad3",
    content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
    todoList: "93284ea7-3c76-4d80-92ec-d8f70b1dfa40",
  },
  {
    id: "f741ae06-3c46-485a-8db7-9efef3a77b93",
    content: "Responsibility demands sacrifice",
    todoList: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  },
  {
    id: "f2e75823-e3f6-4e45-b43c-8c98d0bb3447",
    content: "That's it! The answer was so simple, I was too smart to see it!",
    todoList: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  },
  {
    id: "857b4c32-b515-4ea2-8841-94a158d3fd4e",
    content: "I should not have drunk that much tea!",
    todoList: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  },
  {
    id: "4c46eae3-f8c4-4ab4-aaa0-363b5890d34c",
    content: "Please! I need the real you!",
    todoList: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  },
  {
    id: "7e64f189-e70a-4ee0-846e-a4d7782280ee",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    todoList: "750701bc-8c61-44f7-a34e-b514fec3b8a3",
  },
];

function getTodos(listId: string): Todo[] {
  return todos.filter((e) => {
    return e.todoList === listId;
  });
}

export function generateTodoItemMap(): TodoItemMap {
  return todoLists.reduce(
    (previous: TodoItemMap, todoList: TTodoList) => ({
      ...previous,
      [todoList.id]: getTodos(todoList.id),
    }),
    {}
  );
}

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
        todos[Math.floor(predictableMathRandom() * todos.length)].content,
      done: false,
    };
  });
}

// export function generateTodoListMap(
//   lists: TTodoList[],
//   todoItems: TTodoItem[]
// ): TodoItemMap {
//   lists.reduce((previous: TodoItemMap, listId: GUID) => ({
//     ...previous,
//     [listId.str]: todoItems.filter((e) => e.listId.str === listId.str),
//   }));
// }
