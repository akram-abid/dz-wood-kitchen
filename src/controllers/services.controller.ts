import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { servicePostService } from "../services/services.service";
import { dbDrizzle as db } from "../database/db";
import { posts } from "../database/schema";
import { eq } from "drizzle-orm";
import {
  addPostSchema,
  deletePostParamsSchema,
  getByAdminParamsSchema,
  getPostByIdSchema,
} from "../dtos/services.dtos";

export const addPostHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = addPostSchema.parse(req.body);

    const post = await servicePostService.addPost(body);

    return reply.code(201).send({ success: true, post });
  } catch (error: any) {
    req.log.error("Add post error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const deletePostHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = deletePostParamsSchema.parse(req.params);

    const deleted = await servicePostService.removePost(
      id,
      req.ctx.user?.userId!,
    );

    return reply.send({ success: true, deleted });
  } catch (error: any) {
    req.log.error("Delete post error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const getPostsByAdminHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { page, limit } = getByAdminParamsSchema.parse(req.query);

    const posts = await servicePostService.getPostsByAdmin(page, limit);

    return reply.send({ success: true, posts });
  } catch (error: any) {
    req.log.error("Get posts error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const getPostsById = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { postId } = getPostByIdSchema.parse(req.params);

    const post = await servicePostService.getPostById(postId);

    return reply.send({ success: true, post });
  } catch (error: any) {
    req.log.error("Get posts error", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const updatePostHandler = async (
  req: FastifyRequest<{
    Params: { postId: string };
    Body: {
      title?: string;
      description?: string;
      price?: string;
      woodType?: string;
      estimatedTime?: string;
      items?: string[];
      imageFilenames?: string[];
      adminId?: string;
    };
  }>,
  reply: FastifyReply,
) => {
  try {
    const { postId } = req.params;
    const {
      title,
      description,
      price,
      woodType,
      estimatedTime,
      items,
      imageFilenames,
      adminId,
    } = req.body;

    if (!adminId) {
      return reply.code(401).send({
        success: false,
        message: "Unauthorized: adminId missing",
      });
    }

    const updateData: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price }),
      ...(woodType && { woodType }),
      ...(estimatedTime && { estimatedTime }),
      ...(items && { items }),
    };

    if (imageFilenames && imageFilenames.length > 0) {
      const imageUrls = imageFilenames.map(
        (filename) => `/pictures/services/${filename}`,
      );
      updateData.imageUrls = imageUrls;
    }

    const updatedPost = await servicePostService.updatePost(
      postId,
      adminId,
      updateData,
    );

    return reply.send({ success: true, post: updatedPost });
  } catch (error: any) {
    req.log.error("Error updating post:", error);
    return reply.code(400).send({
      success: false,
      message: error.message || "Failed to update post",
    });
  }
};

export const filterByWoodTypeHandler = async (
  req: FastifyRequest<{
    Querystring: {
      woodType: string;
      page: number;
    };
  }>,
  reply: FastifyReply,
) => {
  const { woodType, page } = req.query;

  try {
    const offset = (page - 1) * 10;

    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.woodType, woodType))
      .limit(10)
      .offset(offset);

    return reply.code(200).send({
      success: true,
      message: "Posts fetched successfully",
      data: result,
    });
  } catch (error: any) {
    req.log.error("Error retrieving posts for admin:", error);
    return reply.code(400).send({
      success: false,
      message: error.message || "Failed to fetch posts",
    });
  }
};
