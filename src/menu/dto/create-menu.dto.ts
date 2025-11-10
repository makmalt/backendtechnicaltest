/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  iconType?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  iconType?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
