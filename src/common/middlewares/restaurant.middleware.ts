import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/jwt";

interface RequestWithRestaurant extends Request {
  restaurant: { id: string };
}

export const restaurantMiddleware = (
  req: RequestWithRestaurant,
  res: Response,
  next: NextFunction
) => {
  const restaurantToken = req.headers.restaurant;

  if (!restaurantToken) {
    return next();
  }

  const result = validateToken(restaurantToken as string);

  req.restaurant = { id: result.id };

  next();
};
