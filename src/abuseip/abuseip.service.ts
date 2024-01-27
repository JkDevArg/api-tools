import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import axios from 'axios';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Role } from 'src/common/enums/rol.enum';
import { ABUSEIP } from './entities/abuseip.entity';
import { getAbuseIpDto, pingIp } from './dto/abuseip.dto';

@Injectable()
export class AbuseipService {
    private readonly key = process.env.ABUSEIP_KEY;
    private readonly url = process.env.ABUSEIP_URL;
    private readonly url_ping = process.env.ABUSE_PING_URL;
    private readonly key_ping = process.env.ABUSEIP_PING_KEY;

    constructor(
        @InjectRepository(ABUSEIP)
        private readonly saveDataAbuseIpRepository: Repository<ABUSEIP>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getReportsByIp(getAbuseIpDto: getAbuseIpDto, user: UserActiveInterface) {
        const axiosPromise = axios.get(`${this.url}/check?ipAddress=${getAbuseIpDto.ip}`);
        const resp = await axiosErrorHandler(axiosPromise);

        console.log(resp);
    }

    async setPing(setPingDto: pingIp, user: UserActiveInterface){
        const cachePingExists = await this.cacheManager.get('data_ping');

        if (cachePingExists && cachePingExists['ip'] === setPingDto.ip) {
            return cachePingExists;
        }
        
        const axiosPromise = axios.get(`${this.url_ping}/tools/ping-receive?ip_address=${setPingDto.ip}&_token=${this.key_ping}&feedback=&email&url=https%3A%2F%2Fwww.abuseipdb.com%2Ftools%2Fping`);
        const resp = await axiosErrorHandler(axiosPromise);

        const pingExists = await this.validatePingExists(setPingDto.ip);

        if (pingExists.length === 0) {
            await this.saveDataAbuseIpRepository.save({
                ...setPingDto,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_ping', { ip: setPingDto.ip, data: resp });
        }

        return pingExists ? pingExists : resp;
    }

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveDataAbuseIpRepository.find();
        }
        return await this.saveDataAbuseIpRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validatePingExists(ip: string){
        return await this.saveDataAbuseIpRepository.find({
            where: { ip: ip },
        });
    }
}
