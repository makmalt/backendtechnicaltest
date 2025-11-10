import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Prisma } from '.prisma/client/wasm';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const menus = await this.prisma.menu.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: true, // sampai depth 5
                  },
                },
              },
            },
          },
        },
      },
    });
    return menus;
  }

  // Get one
  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  // Create
  async create(dto: CreateMenuDto) {
    let depth = 1;
    if (dto.parentId) {
      const parent = await this.prisma.menu.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent not found');
      depth = parent.depth + 1;
    }

    return this.prisma.menu.create({
      data: { ...dto, depth } as Prisma.MenuCreateInput,
    });
  }

  // Update
  async update(id: string, dto: UpdateMenuDto) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');
    return this.prisma.menu.update({
      where: { id },
      data: dto as Prisma.MenuUpdateInput,
    });
  }

  // Delete (with children)
  async delete(id: string) {
    // delete all children first
    await this.prisma.menu.deleteMany({ where: { parentId: id } });
    return this.prisma.menu.delete({ where: { id } });
  }

  // Move menu to different parent
  async move(id: string, newParentId: string) {
    const parent = await this.prisma.menu.findUnique({
      where: { id: newParentId },
    });
    if (!parent) throw new NotFoundException('Parent not found');

    const newDepth = parent.depth + 1;
    return this.prisma.menu.update({
      where: { id },
      data: { parentId: newParentId, depth: newDepth },
    });
  }

  // Reorder menu within same level
  async reorder(id: string, newOrderIndex: number) {
    return this.prisma.menu.update({
      where: { id },
      data: { orderIndex: newOrderIndex },
    });
  }
}
