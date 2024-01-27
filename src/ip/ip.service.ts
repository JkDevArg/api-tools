import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { IP } from './entities/ip.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getIpDto } from './dto/ip.dto';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class IpService {
    private readonly key = process.env.IPGEO_KEY;
    private readonly url = process.env.IPGEO_URL;

    constructor(
        @InjectRepository(IP)
        private readonly saveDataIpRepository: Repository<IP>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getDataIp(getIpDto: getIpDto, user: UserActiveInterface) {
        // Intenta obtener la información de la API externa usando Axios
        const axiosPromise = axios.get(`${this.url}ipgeo?apiKey=${this.key}&ip=${getIpDto.ip}`);
        const resp = await axiosErrorHandler(axiosPromise);

        const cacheIpExists = await this.cacheManager.get('data_ip');

        if (cacheIpExists && cacheIpExists['ip'] === getIpDto.ip) {
            return cacheIpExists;
        }

        const ipExists = await this.validateIpExists(getIpDto.ip);

        if (ipExists.length === 0) {
            await this.saveDataIpRepository.save({
                ...getIpDto,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_ip', { ip: getIpDto.ip, data: resp });
        }

        return ipExists ? ipExists : resp;
    }
    
    

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveDataIpRepository.find();
        }
        return await this.saveDataIpRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validateIpExists(ip: string){
        return await this.saveDataIpRepository.find({
            where: { ip: ip },
        });
    }
    
    
}

