import {
  boolean,
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const userTypeEnum = pgEnum("userRole", ["Creator", "Supporter"]);

export const projectCategory = pgEnum("projectCategory", [
  "Art",
  "Comics",
  "Crafts",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Journalism",
  "Music",
  "Photography",
  "Mechanical",
  "Software & It",
  "Artificial Intelligence",
  "Green Energy",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  userRole: userTypeEnum("user_type").default("Supporter").notNull(),
  image: text("image"),
  dateOfBirth: timestamp("dateOfBirth", { mode: "date" }),
  bio: text("bio"),
  createAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationToken = pgTable(
  "verificationToken",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.email, vt.token] }),
  })
);

export const passwordResetToken = pgTable(
  "passwordResetToken",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.email, vt.token] }),
  })
);

// -- Project Table
export const projects = pgTable("projects", {
  projectId: uuid("project_id").defaultRandom().primaryKey(),
  user_id: text("id")
    .notNull()
    .references(() => users.id),
  category: projectCategory("category").notNull(),
  title: varchar("title", { length: 255 }).unique().notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  lauchDate: date("lauch_date", { mode: "string" }).notNull(),
  projectDuration: text("project_duration").notNull(),
  description: text("description").notNull(),
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  video: text("video"),
  currentAmout: decimal("current_amount", { precision: 10, scale: 2 }).default(
    "42"
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// -- Comments Table
export const comments = pgTable("comments", {
  commentId: uuid("comment_id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.projectId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// -- Likes Table
export const likes = pgTable("likes", {
  likeId: uuid("like_id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.projectId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("craeted_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// Support Table
export const support = pgTable("support", {
  stripeSessionId: text("stripe_session_id").notNull(),
  supportId: uuid("support_id").defaultRandom().primaryKey(),
  verified: boolean("verified").default(false),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.projectId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("create_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// -- Posts Table
export const posts = pgTable("posts", {
  postId: uuid("post_id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.projectId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// -- PostLikes Table
export const postLikes = pgTable("post_likes", {
  postLikeId: uuid("post_like_id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.postId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// -- Post_comment Table
export const postComments = pgTable("post_comments", {
  postCommentId: uuid("post_comment_id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.postId),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// payment-account Table
export const paymentAccount = pgTable("payment_account", {
  accountId: uuid("account_id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => users.id),
  stripeAccountId: varchar("stripe_account_id", { length: 255 })
    .notNull()
    .unique(),
  stripeLinked: boolean("stripe_linked").default(false),
  createAt: timestamp("created_at").defaultNow(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
