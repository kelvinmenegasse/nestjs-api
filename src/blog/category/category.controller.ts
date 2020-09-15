import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe, Logger, UseGuards } from '@nestjs/common';
import { ValidationParametersPipe } from 'src/shared/pipes/validation-parameters.pipe';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AppController } from 'src/app.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { AddCategoryDTO, UpdateCategoryDTO, FindCategoryDTO } from './dto';

@Controller('api/admin/category')
export class CategoryController {

    private logger = new Logger(AppController.name);

    constructor(private categoryService: CategoryService) { }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async listCategory(@Body() findCategory: FindCategoryDTO): Promise<Category[] | null> {
        if (findCategory) { return await this.categoryService.fetchAll(findCategory) }

        return await this.categoryService.fetchAll({ status: 'ativo' });
    }

    @Post('get/:id')
    @UseGuards(JwtAuthGuard)
    async getCategory(@Param('id', ValidationParametersPipe) id: number): Promise<Category> {
        return await this.categoryService.getByID(id);
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async addCategory(
        @Body() category: AddCategoryDTO,
    ): Promise<Category | null> {
        return await this.categoryService.addCategory(category);
    }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async updateCategory(
        @Body() category: UpdateCategoryDTO
    ): Promise<Category> {

        return await this.categoryService.updateCategory(category);
    }

    @Post('remove/:id')
    @UseGuards(JwtAuthGuard)
    async removeCategory(@Param('id', ValidationParametersPipe) id: number): Promise<any> {
        return await this.categoryService.removeCategory(id);
    }

    @Post('delete/:id')
    @UseGuards(JwtAuthGuard)
    async permanentlyDeleteCategory(@Param('id', ValidationParametersPipe) id: number): Promise<any> {
        return await this.categoryService.permanentlyDeleteCategory(id);
    }
}
