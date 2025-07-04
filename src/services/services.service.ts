import { eq, and } from "drizzle-orm";
import { dbDrizzle as db } from "../database/db";
import { posts } from "../database/schema";
import { logger } from "../utils/logger";
import { SERVICE_ERRORS } from "../utils/errors-handler";
import { jsonb } from "drizzle-orm/pg-core";
import { cleanupFiles } from "../utils/uploader";
import path from "path";
interface PostInput {
  title: string;
  description: string;
  woodType: string;
  adminId: string;
  mediaFilenames: string[];
  items?: string[];
  location?: string;
}

type UpdatePostInput = Partial<Omit<PostInput, "adminId">>;

export class ServicePostService {
  async addPost(data: PostInput) {
    try {
      if (data.mediaFilenames.length > 15) {
        throw new Error(SERVICE_ERRORS.MAX_IMAGES);
      }

      const imageUrls = data.mediaFilenames.map(
        (filename) => `/pictures/services/${filename}`,
      );

      const items = data.items?.map((item) => item.trim());

      /*console.log("💬 insert debug", {
        title: data.title,
        imageUrls,
        items,
        typeofImageUrls: typeof imageUrls,
        typeofItems: typeof items,
        isImageUrlsArray: Array.isArray(imageUrls),
        isItemsArray: Array.isArray(items),
      });*/

      /*console.log("🔥 About to insert:", {
        imageUrls: data.mediaFilenames.map(
          (filename) => `/pictures/services/${filename}`,
        ),
        items: data.items?.map((item) => item.trim()),
      });*/

      const newPost = await db
        .insert(posts)
        .values({
          title: data.title,
          description: data.description,
          woodType: data.woodType,
          createdBy: data.adminId,
          imageUrls,
          items: items ?? [],
          location: data.location ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .execute()
        .catch((err) => {
          console.error("❌ DB ERROR SQL:", err);
          throw err;
        });

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
  async updatePost(postId: string, data: UpdatePostInput) {
    try {
      const existingPost = await db
        .select()
        .from(posts)
        .where(and(eq(posts.id, postId)));

      if (existingPost.length === 0) {
        throw new Error(SERVICE_ERRORS.POST_NOT_FOUND);
      }

      const updatedData: Record<string, any> = { ...data };

      if (data.mediaFilenames) {
        updatedData.imageUrls = data.mediaFilenames.map(
          (filename) => `/pictures/services/${filename}`,
        );
        const oldImages = existingPost[0].imageUrls.map((flPath) =>
          path.join(process.cwd(), flPath),
        );
        cleanupFiles(oldImages).catch((err) =>
          logger.warn("Cleanup failed:", err),
        );
      }

      delete updatedData.mediaFilenames;

      const result = await db.update(posts).set(updatedData).returning();

      logger.info("Post updated successfully", {
        postId,
        updatedFields: Object.keys(data),
      });

      return result[0];
    } catch (error) {
      logger.error("Error updating post:", error);
      throw error;
    }
  }
}

export const servicePostService = new ServicePostService();
