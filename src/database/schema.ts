import {
  pgTable,
  text,
  timestamp,
  decimal,
  json,
  boolean as pgBoolean,
  doublePrecision,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["admin", "user"]);

// Users table
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  role: userRoleEnum("role")
    .notNull()
    .$default(() => "user"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("fullName").notNull(),
  phoneNumber: text("phoneNumber"),
  oauthprovider: text("oauthprovider"),
  oauthId: text("oauthId"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Admins table
/*export const admins = pgTable("admins", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  lastname: text("lastname").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});*/

// Posts table
export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  woodType: text("wood_type").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  items: text("items").array(),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title"),
  trackingNumber: serial("tracking_number").notNull().unique(),
  description: text("description").notNull(),
  email: text("email").notNull(),
  fullName: text("fullName").notNull(),
  woodType: text("wood_type"),
  status: text("status").$default(() => "validation"),
  isValidated: pgBoolean("is_validated").$default(() => false),
  offer: doublePrecision("offer"),
  installments:
    json("installments").$type<{ date: string; amount: number }[]>(),
  articles: json("articles"),
  daira: text("daira").notNull(),
  street: text("street").notNull(),
  baladia: text("baladia").notNull(),
  wilaya: text("wilaya").notNull(),
  phoneNumber: text("phone_number").notNull(),

  mediaUrls: text("edia_urls").array(),

  postId: text("post_id").references(() => posts.id, { onDelete: "set null" }),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations
export const adminsRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.createdBy],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [orders.postId],
    references: [posts.id],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Admin = typeof users.$inferSelect;
export type NewAdmin = typeof users.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
