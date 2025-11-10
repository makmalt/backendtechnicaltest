import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'Get all menus' })
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @ApiOperation({ summary: 'Get menu by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new menu' })
  @Post()
  create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @ApiOperation({ summary: 'Update a menu by ID' })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a menu by ID' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.menuService.delete(id);
  }

  @ApiOperation({ summary: 'Move a menu to a new parent' })
  @Patch(':id/move')
  move(@Param('id') id: string, @Body('parentId') parentId: string) {
    return this.menuService.move(id, parentId);
  }

  @ApiOperation({ summary: 'Reorder a menu item' })
  @Patch(':id/reorder')
  reorder(@Param('id') id: string, @Body('orderIndex') orderIndex: number) {
    return this.menuService.reorder(id, orderIndex);
  }
}
