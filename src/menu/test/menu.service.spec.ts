import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from '../menu.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: PrismaService,
          useValue: {
            menu: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return tree structure', async () => {
      const mockMenus = [
        { id: '1', name: 'Root', parentId: null, orderIndex: 1, depth: 1 },
        { id: '2', name: 'Child', parentId: '1', orderIndex: 2, depth: 2 },
      ];

      (prisma.menu.findMany as jest.Mock).mockResolvedValue(mockMenus);
      const result = await service.findAll();

      expect(prisma.menu.findMany).toHaveBeenCalled();
      expect(result[0].children[0].name).toBe('Child');
    });
  });

  describe('findOne', () => {
    it('should return one menu when found', async () => {
      (prisma.menu.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Root',
        parentId: null,
      });

      const result = await service.findOne('1');
      expect(result.name).toBe('Root');
    });

    it('should throw NotFoundException if not found', async () => {
      (prisma.menu.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create root menu when no parentId', async () => {
      (prisma.menu.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Root',
      });

      const result = await service.create({ name: 'Root' });
      expect(result).toEqual({ id: '1', name: 'Root' });
    });

    it('should throw NotFoundException if parent not found', async () => {
      (prisma.menu.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.create({ name: 'Child', parentId: '999' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update existing menu', async () => {
      (prisma.menu.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Old',
      });
      (prisma.menu.update as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Updated',
      });

      const result = await service.update('1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException if menu not found', async () => {
      (prisma.menu.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.update('999', { name: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete menu and its children recursively', async () => {
      (prisma.menu.findMany as jest.Mock)
        .mockResolvedValueOnce([{ id: '2', parentId: '1' }])
        .mockResolvedValue([]); // ✅ setiap panggilan berikutnya return []

      (prisma.menu.delete as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await service.delete('1');
      expect(result.id).toBe('1');
      expect(prisma.menu.findMany).toHaveBeenCalledWith({
        where: { parentId: '1' },
        select: { id: true },
      });
    });
  });
});
