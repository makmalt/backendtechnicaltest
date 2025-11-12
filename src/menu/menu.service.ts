/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Prisma } from '.prisma/client/wasm';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}
  private buildTree(menus: any[], parentId: string | null = null) {
    return menus
      .filter((menu) => menu.parentId === parentId)
      .map((menu) => ({
        ...menu,
        children: this.buildTree(menus, menu.id),
      }));
  }

  // Get all
  async findAll() {
    const allMenus = await this.prisma.menu.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    const menuTree = this.buildTree(allMenus);
    return menuTree;
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

  // Delete semua
  async delete(id: string) {
    const children = await this.prisma.menu.findMany({
      where: { parentId: id },
      select: { id: true },
    });

    // hapus children
    for (const child of children) {
      await this.delete(child.id);
    }

    // hapus parent
    return this.prisma.menu.delete({ where: { id } });
  }
}
