import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatgptDto } from './dto/create-chatgpt.dto';
import { UpdateChatgptDto } from './dto/update-chatgpt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatgpt } from './entities/chatgpt.entity';
import { Repository } from 'typeorm';
import { Bots } from 'src/common/enums/bots_enum';
import axios from 'axios';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';

@Injectable()
export class ChatgptService {
    private readonly chat_url_first = `https://api.lolhuman.xyz/api/openai`;
    private readonly chat_url_two = `https://rest-api.akuari.my.id/ai/gpt`;
    private readonly chat_url_three = `https://api.azz.biz.id/api/gpt`;
    private readonly chat_url_four = `https://api-fgmods.ddns.net/api/info/`;
    private readonly chat_url_five = `https://aemt.me/prompt/`;
    constructor(
        @InjectRepository(Chatgpt)
        private readonly chatgptRepository: Repository<Chatgpt>
    ){}
    async create(createChatgptDto: CreateChatgptDto) {
        const botSelected = createChatgptDto.bot;
        let send;
        switch (botSelected) {
            case Bots.LOLHUMAN:
                send = await this.sendData(`${this.chat_url_first}?apikey=GataDios&text=${createChatgptDto.message}&user=apirest`);
                return send;
                break;
            case Bots.AKUARI:
                send = await this.sendData(`${this.chat_url_two}?chat=${createChatgptDto.message}`);
                return send;
                break;
            case Bots.AZZ:
                send = await this.sendData(`${this.chat_url_three}?q=${createChatgptDto.message}&user=Adit`);
                return send;
                break;
            case Bots.GEMINI:
                if(!createChatgptDto.token || createChatgptDto.token.length < 9) throw new BadRequestException('Invalid token');
                send = await this.sendData(`${this.chat_url_four + Bots.GEMINI}?text=${createChatgptDto.message}&apikey=${createChatgptDto.token}`);
                return send;
                break;
            case Bots.OPENAI:
                if(!createChatgptDto.token || createChatgptDto.token.length < 9) throw new BadRequestException('Invalid token');
                send = await this.sendData(`${this.chat_url_four + Bots.OPENAI}?text=${createChatgptDto.message}&apikey=${createChatgptDto.token}`);
                return send;
                break;
            case Bots.OPENAI2:
                if(!createChatgptDto.token || createChatgptDto.token.length < 9) throw new BadRequestException('Invalid token');
                send = await this.sendData(`${this.chat_url_four + Bots.OPENAI2}?text=${createChatgptDto.message}&apikey=${createChatgptDto.token}`);
                return send;
                break;
            case Bots.AEMT:
                if(!createChatgptDto.prompt || createChatgptDto.prompt.length < 5) throw new BadRequestException('Prompt is required');
                send = await this.sendData(`${this.chat_url_five}?prompt=${createChatgptDto.prompt}&text=${createChatgptDto.message}`);
                return send;
                break;
            default:
                throw new BadRequestException(`Bot doesn't exists, bots availables: ${Bots.LOLHUMAN}, ${Bots.AKUARI}, ${Bots.AZZ}, ${Bots.GEMINI}, ${Bots.OPENAI}, ${Bots.OPENAI2}, ${Bots.AEMT}`);
                break;
        }
    }

    async sendData(url: string, msg = '', token = ''){
        const axiosPromise = axios.get(`${url}`);
        const resp = await axiosErrorHandler(axiosPromise);
        return resp;
    }
}
