import { users, paymentAccount, posts, projects } from "./schema";

export type user = typeof users.$inferSelect;

export type paymentAcccount = typeof paymentAccount.$inferSelect;

export type project = typeof projects.$inferInsert;

export type posts = typeof posts.$inferInsert;