import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from '../menu.controller';
import { MenuService } from '../menu.service';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  it('should return all menus', async () => {
    const mockMenus = [{ id: '1', name: 'Root' }];
    (service.findAll as jest.Mock).mockResolvedValue(mockMenus);

    const result = await controller.findAll();
    expect(result).toEqual(mockMenus);
  });

  it('should return a menu by id', async () => {
    const mockMenu = { id: '1', name: 'Root' };
    (service.findOne as jest.Mock).mockResolvedValue(mockMenu);

    const result = await controller.findOne('1');
    expect(result).toEqual(mockMenu);
  });

  it('should create a menu', async () => {
    const dto = { name: 'New Menu' };
    const createdMenu = { id: '1', name: 'New Menu' };

    (service.create as jest.Mock).mockResolvedValue(createdMenu);

    const result = await controller.create(dto);
    expect(result).toEqual(createdMenu);
  });

  it('should update a menu', async () => {
    const dto = { name: 'Updated' };
    const updatedMenu = { id: '1', name: 'Updated' };

    (service.update as jest.Mock).mockResolvedValue(updatedMenu);

    const result = await controller.update('1', dto);
    expect(result).toEqual(updatedMenu);
  });

  it('should delete a menu', async () => {
    const deletedMenu = { id: '1', name: 'Deleted' };
    (service.delete as jest.Mock).mockResolvedValue(deletedMenu);

    const result = await controller.delete('1');
    expect(result).toEqual(deletedMenu);
  });
});
