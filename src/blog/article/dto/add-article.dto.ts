import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class AddArticleDTO {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    summary: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    dateStart: string;

    @IsOptional()
    @IsString()
    dateEnd: string;

    @IsOptional()
    @IsString()
    tags: string;

    @IsOptional()
    @IsBoolean()
    featured: boolean;
    
    @IsNotEmpty()
    @IsNumber()
    accountId: number;

    @IsNotEmpty()
    @IsNumber()
    channelId: number;

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @IsOptional()
    @IsString()
    status?: string;
}
