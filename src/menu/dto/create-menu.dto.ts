import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({
    example: 'Dashboard',
    description: 'Nama menu',
  })
  name: string;

  @ApiProperty({
    example: 'b9f7c2e8-9c12-4a4d-8e83-3b8a4c5f2e55',
    description: 'ID parent menu (nullable jika root)',
    required: false,
    nullable: true,
  })
  parentId?: string | null;

  @ApiProperty({
    example: 'FOLDER',
    description: 'Tipe ikon menu (FOLDER atau MENU)',
    required: false,
  })
  iconType?: string;

  @ApiProperty({
    example: true,
    description: 'Apakah menu tampil di sidebar',
    required: false,
  })
  isVisible?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Urutan tampilan menu',
    required: false,
  })
  orderIndex?: number;
}
