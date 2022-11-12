import { Request, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ITypedResponse } from "../interfaces/typedResponse.interface";
import { CustomException } from "../exceptions/http.exception";

export default function errorHandler(
  err: CustomException,
  req: Request,
  res: ITypedResponse,
  next: NextFunction
) {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  return res.status(status).json({
    result: "ERROR",
    code: status,
    error: errorMessage,
  });
}
