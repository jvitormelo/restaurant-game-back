import { PartialType } from "@nestjs/mapped-types";
import { CookStatus } from "../types/cooksStatus";
import { CreateCookDto } from "./create-cooker.dto";

export class UpdateCookDto extends PartialType(CreateCookDto) {
  id: string;
  status?: CookStatus;
  experience?: number;
  level?: number;
}
