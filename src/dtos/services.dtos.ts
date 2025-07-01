import { z } from "zod";

export const addPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()).max(20).optional(),
  woodType: z.string(),
  location: z.string().optional(),
  adminId: z.string().uuid(),
  mediaFilenames: z.array(z.string()).max(15),
});

export const updatePostSchema = addPostSchema.partial();

export const deletePostParamsSchema = z.object({
  id: z.string().uuid(),
});

export const getByAdminParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(25).default(15),
});

export const getPostByIdSchema = z.object({
  postId: z.string().uuid(),
});
