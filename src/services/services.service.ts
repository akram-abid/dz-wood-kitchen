import { eq, and } from "drizzle-orm";
import { dbDrizzle as db } from "../database/db";
import { posts } from "../database/schema";
import { logger } from "../utils/logger";
import { SERVICE_ERRORS } from "../utils/errors-handler";

interface PostInput {
  title: string;
  description: string;
  price: string;
  woodType: string;
  estimatedTime: string;
  adminId: string;
  imageFilenames: string[];
  items: string[];
}

type UpdatePostInput = Partial<Omit<PostInput, "adminId">>;

export class ServicePostService {
  async addPost(data: PostInput) {
    try {
      if (data.imageFilenames.length > 15) {
        throw new Error(SERVICE_ERRORS.MAX_IMAGES);
      }

      const imageUrls = data.imageFilenames.map(
        (filename) => `/pictures/services/${filename}`,
      );

      const items = data.items.map((item) => item.trim());

      const newPost = await db
        .insert(posts)
        .values({
          title: data.title,
          description: data.description,
          woodType: data.woodType,
          createdBy: data.adminId,
          imageUrls,
          items,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      logger.info("Post created successfully", {
        postId: newPost[0].id,
        adminId: data.adminId,
      });

      return newPost[0];
    } catch (error) {
      logger.error("Error adding post:", error);
      throw error;
    }
  }

  async removePost(postId: string, adminId: string) {
    try {
      const result = await db
        .delete(posts)
        .where(eq(posts.id, postId))
        .returning();

      if (result.length === 0) {
        throw new Error(SERVICE_ERRORS.POST_NOT_FOUND);
      }

      logger.info("Post deleted successfully", {
        postId,
        adminId,
      });

      return result[0];
    } catch (error) {
      logger.error("Error deleting post:", error);
      throw error;
    }
  }

  async getPostsByAdmin(page: number = 1, limit: number = 15) {
    try {
      const offset = (page - 1) * limit;

      const result = await db.select().from(posts).limit(limit).offset(offset);

      return result;
    } catch (error) {
      logger.error("Error retrieving posts for admin:", error);
      throw error;
    }
  }

  async getPostById(postId: string) {
    try {
      const result = await db.select().from(posts).where(eq(posts.id, postId));
      return result[0];
    } catch (err: any) {
      logger.error("Error retriving post by id:", err);
      throw err;
    }
  }
  async updatePost(postId: string, adminId: string, data: UpdatePostInput) {
    try {
      const existingPost = await db
        .select()
        .from(posts)
        .where(and(eq(posts.id, postId)));

      if (existingPost.length === 0) {
        throw new Error(SERVICE_ERRORS.POST_NOT_FOUND);
      }

      const updatePayload: any = {
        ...("title" in data && { title: data.title }),
        ...("description" in data && { description: data.description }),
        ...("price" in data && { price: data.price }),
        ...("woodType" in data && { woodType: data.woodType }),
        ...("estimatedTime" in data && { estimatedTime: data.estimatedTime }),
        ...("items" in data && { items: data.items }),
        ...("imageFilenames" in data &&
          data.imageFilenames && {
            imageUrls: data.imageFilenames.map(
              (filename) => `/pictures/services/${filename}`,
            ),
          }),
        updatedAt: new Date(),
      };

      const result = await db
        .update(posts)
        .set(updatePayload)
        .where(and(eq(posts.id, postId), eq(posts.createdBy, adminId)))
        .returning();

      logger.info("Post updated successfully", {
        postId,
        adminId,
        updatedFields: Object.keys(updatePayload),
      });

      return result[0];
    } catch (error) {
      logger.error("Error updating post:", error);
      throw error;
    }
  }
}

export const servicePostService = new ServicePostService();
