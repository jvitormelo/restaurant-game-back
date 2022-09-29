import { PartialType } from "@nestjs/mapped-types";
import { CreateCookDto } from "./create-cooker.dto";

export class UpdateCookDto extends PartialType(CreateCookDto) {}
