const chatPopulateQuery = [
  {
    path: "users",
    select: "-password",
  },
  {
    path: "mutedBy",
    select: "-password",
  },
  {
    path: "archivedBy",
    select: "-password",
  },
  {
    path: "pinnedBy",
    select: "-password",
  },
  { path: "latestMessage" },
  // { path: "latestMessage", options: { sort: [{ createdAt: 1 }] } },
];

const messagePopulateQuery = [
  {
    path: "sender",
    select: "-password",
  },
];

export { chatPopulateQuery, messagePopulateQuery };
