import { eq } from "drizzle-orm";
import { dbDrizzle as db } from "../database/db";
import { posts } from "../database/schema";
import { logger } from "../utils/logger";

interface PostInput {
  title: string;
  description: string;
  price: string;
  woodType: string;
  estimatedTime: string;
  adminId: string;
  imageFilenames: string[];
}

export class ServicePostService {
  async addPost(data: PostInput) {
    try {
      if (data.imageFilenames.length > 15) {
        throw new Error("A maximum of 15 images is allowed per post");
      }

      const imageUrls = data.imageFilenames.map(
        (filename) => `/pictures/services/${filename}`,
      );

      const newPost = await db
        .insert(posts)
        .values({
          title: data.title,
          description: data.description,
          price: data.price,
          woodType: data.woodType,
          estimatedTime: data.estimatedTime,
          adminId: data.adminId,
          imageUrls,
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
        throw new Error("Post not found or already deleted");
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

  async getPostsByAdmin() {
    try {
      const result = await db.select().from(posts);

      return result;
    } catch (error) {
      logger.error("Error retrieving posts for admin:", error);
      throw error;
    }
  }

  async getPostById(postId: string) {
    try {
      const result = await db.select().from(posts).where(eq(posts.id, postId));
    } catch (err: any) {
      logger.error("Error retriving post by id:", err);
      throw err;
    }
  }
}

export const servicePostService = new ServicePostService();
