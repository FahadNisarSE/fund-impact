import {
  users,
  paymentAccount,
  posts,
  projects,
  comments,
  support,
  postComments,
} from "./schema";

export type user = typeof users.$inferSelect;

export type paymentAcccount = typeof paymentAccount.$inferSelect;

export type project = typeof projects.$inferInsert;

export type posts = typeof posts.$inferInsert;

export type comments = typeof comments.$inferSelect;

export type support = typeof support.$inferSelect;

export type postComments = typeof postComments.$inferSelect;