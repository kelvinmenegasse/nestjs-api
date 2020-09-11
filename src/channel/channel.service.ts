import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { AddChannelDTO, UpdateChannelDTO, FindChannelDTO } from './dto';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
    ) { }

    async fetchAll(by: FindChannelDTO): Promise<Channel[]> {
        return await this.channelRepository.find({ where: by });
    }

    async getByID(id: number): Promise<Channel>{
        return await this.channelRepository.findOne({ id });
    }

    async addChannel(channel: AddChannelDTO): Promise<Channel> {

        const { title } = channel;

        const isChannelFound = await this.channelRepository.findOne({ title });

        if (isChannelFound) {
            throw new BadRequestException(`O Canal "${title}" já está cadastrado`);
        }

        const newChannel = Object.assign(new Channel(), channel);

        return await this.channelRepository.save(newChannel);
    }

    async updateChannel(channel: UpdateChannelDTO): Promise<Channel> {
        
        const id: number = channel.id;

        const channelFound = await this.channelRepository.findOne({ id });

        if (!channelFound) {
            throw new NotFoundException(`Canal com ID "${id}" não encontrado`);
        }

        const updatedChannel = Object.assign(channelFound, channel);

        return await this.channelRepository.save(updatedChannel);
    }

    async removeChannel(id: number): Promise<Channel> {

        const channelFound = await this.channelRepository.findOne({ id });

        if (!channelFound) {
            throw new NotFoundException(`Canal com ID "${id}" não encontrado`);
        }

        const newChannel = Object.assign(channelFound, {
            status: 'removido'
        });

        return await this.channelRepository.save(newChannel);

    }

    async permanentlyDeleteChannel(id: number): Promise<any> {

        let channelFound = await this.channelRepository.findOne({ id });

        if (!channelFound) {
            throw new NotFoundException(`Canal com ID "${id}" não encontrado`);
        }

        await this.channelRepository.delete(id);

        channelFound = await this.channelRepository.findOne({ id });

        if (channelFound) {
            return JSON.stringify({
                message: `Não foi possível deletar o canal com ID "${id}"`,
                type: 'error',
            });
        }

        return JSON.stringify({
            message: 'Deletado com sucesso',
            type: 'success',
        });

    }
}
