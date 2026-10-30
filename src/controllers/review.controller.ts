import type { Request, Response } from "express";
import {
  createReview as createReviewService,
  deleteReview as deleteReviewService,
  listAllReviews,
  listPublishedReviews,
  updateReview as updateReviewService,
} from "../services/review.service.js";
import { AppError } from "../utils/appError.js";
import type {
  CreateReviewInput,
  UpdateReviewInput,
} from "../validation/review.schema.js";

function getReviewId(request: Request): string {
  const { id } = request.params;
  if (typeof id !== "string" || id.length === 0) {
    throw new AppError("A valid review id is required.", 400);
  }
  return id;
}

export async function listPublicReviews(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: await listPublishedReviews() });
}

export async function listAdminReviews(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: await listAllReviews() });
}

export async function createReview(request: Request, response: Response): Promise<void> {
  const review = await createReviewService(request.body as CreateReviewInput);
  response.status(201).json({ data: review });
}

export async function updateReview(request: Request, response: Response): Promise<void> {
  const review = await updateReviewService(
    getReviewId(request),
    request.body as UpdateReviewInput,
  );
  response.status(200).json({ data: review });
}

export async function deleteReview(request: Request, response: Response): Promise<void> {
  await deleteReviewService(getReviewId(request));
  response.status(204).end();
}
