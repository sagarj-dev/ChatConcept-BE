const chatPopulateQuery = [
  {
    path: "users",
    select: "-password",
  },
  {
    path: "admin",
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
  // { path: "latestMessage" },
  { path: "latestMessage", options: { sort: [{ updatedAt: "desc" }] } },
];

const messagePopulateQuery = [
  {
    path: "sender",
    select: "-password",
  },
];

export { chatPopulateQuery, messagePopulateQuery };
