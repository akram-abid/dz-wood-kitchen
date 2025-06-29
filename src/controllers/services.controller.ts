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
import { handleControllerError } from "../utils/errors-handler";
import * as APIError from "../utils/errors";

export const addPostHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = addPostSchema.parse(req.body);

    const post = await servicePostService.addPost(body);

    reply.status(201);
    return post;
  } catch (error: any) {
    handleControllerError(error, "add post", req.log);
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

    reply.status(200);
    return deleted;
  } catch (error: any) {
    handleControllerError(error, "delete post", req.log);
  }
};

export const getPostsByAdminHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { page, limit } = getByAdminParamsSchema.parse(req.query);

    const posts = await servicePostService.getPostsByAdmin(page, limit);

    reply.status(200);
    return { posts };
  } catch (error: any) {
    handleControllerError(error, "get psots", req.log);
  }
};

export const getPostsById = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { postId } = getPostByIdSchema.parse(req.params);

    const post = await servicePostService.getPostById(postId);

    reply.status(200);
    return post;
  } catch (error: any) {
    handleControllerError(error, "get post by id", req.log);
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
      throw new APIError.UnauthorizedError("Unauthorized: adminId missing");
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

    reply.status(200);
    return { post: updatedPost };
  } catch (error: any) {
    handleControllerError(error, "update post", req.log);
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

    reply.code(200);

    return { result };
  } catch (error: any) {
    handleControllerError(error, "filter by wood type", req.log);
  }
};
