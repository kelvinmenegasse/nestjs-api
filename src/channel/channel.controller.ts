import {
    Controller, Post, Get, Body, Param, UsePipes, ValidationPipe, Logger, UseGuards, UseInterceptors, UploadedFile, Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationParametersPipe } from 'src/shared/pipes/validation-parameters.pipe';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AppController } from 'src/app.controller';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';
import { AddChannelDTO, UpdateChannelDTO, FindChannelDTO } from './dto';

@Controller('api/admin/channel')
export class ChannelController {

    private logger = new Logger(AppController.name);

    constructor(private channelService: ChannelService) { }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async listChannel(@Body() findChannel: FindChannelDTO): Promise<Channel[] | null> {
        if (findChannel) { return await this.channelService.fetchAll(findChannel) }

        return await this.channelService.fetchAll({ status: 'ativo' });
    }

    @Post('get/:id')
    @UseGuards(JwtAuthGuard)
    async getChannel(@Param('id', ValidationParametersPipe) id: number): Promise<any> {
        console.log(id)
        return await this.channelService.getByID(id);
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async addChannel(@Body() channel: AddChannelDTO): Promise<Channel | null> {
        return await this.channelService.addChannel(channel);
    }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async updateChannel(@Body() channel: UpdateChannelDTO): Promise<Channel> {
        return await this.channelService.updateChannel(channel);
    }

    @Post('remove/:id')
    @UseGuards(JwtAuthGuard)
    async removeChannel(@Param('id', ValidationParametersPipe) id: number): Promise<any> {
        return await this.channelService.removeChannel(id);
    }

    @Post('delete/:id')
    @UseGuards(JwtAuthGuard)
    async permanentlyDeleteChannel(@Param('id', ValidationParametersPipe) id: number): Promise<any> {
        return await this.channelService.permanentlyDeleteChannel(id);
    }

    @Post('upload-image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadThumb(@Body() bla: any, @UploadedFile() file, @Res() res: any): Promise<Channel | null> {
        return res.sendFile(file, { root: './files' });
    }

    // list
    // get -> id
    // add -> channel
    // update -> channel
    // remove -> id
    // delete -> id
    // upload -> id, file

}
