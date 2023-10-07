import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"
import { UserSortBy, UserStatuses } from "./user.interface"
import { SortDirection } from "../../../common/constant"

export class FindManyUserDto {
  @ApiProperty({ required: false, default: SortDirection.DESC, enum: SortDirection })
  @IsOptional()
  @IsEnum(SortDirection)
  @IsNotEmpty()
  sortDirection?: SortDirection;

  @ApiProperty({ required: false, default: UserSortBy.CREATED_AT, enum: UserSortBy })
  @IsOptional()
  @IsEnum(UserSortBy)
  @IsNotEmpty()
  sortBy?: UserSortBy;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  limit?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  offset?: number;

  @ApiProperty({
    required: false,
    type: 'array',
    items: { type: 'string' }
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty( { each: true })
  @ArrayMinSize(1)
  userIds?: string[];

  @ApiProperty({
    required: false,
    type: 'array',
    items: { type: 'string' }
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty( { each: true })
  @ArrayMinSize(1)
  emails?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({ required: false, enum: UserStatuses })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserStatuses)
  status?: UserStatuses
}

export class FindOneUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string
}