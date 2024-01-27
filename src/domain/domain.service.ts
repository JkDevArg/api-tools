import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Domain } from './entities/domain.entity';
import { getDomainDto } from './dto/domain.dto';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class DomainService {
    private readonly key = process.env.DOMAIN_TOKEN;
    private readonly url = process.env.DOMAIN_URL;

    constructor(
        @InjectRepository(Domain)
        private readonly saveDataDomainRepository: Repository<Domain>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getDataDomain(getDomainDto: getDomainDto, user: UserActiveInterface){

        const axiosPromise = axios.get(`${this.url}api/full/${getDomainDto.domain}?token=${this.key}`);
        const resp = await axiosErrorHandler(axiosPromise);

        const cacheDomainExists = await this.cacheManager.get('data_domain');

        if (cacheDomainExists && cacheDomainExists['domain'] === getDomainDto.domain) {
            return cacheDomainExists;
        }

        const domainExists = await this.validateDomainExists(getDomainDto.domain);

        if (domainExists.length === 0) {
            await this.saveDataDomainRepository.save({
                ...getDomainDto,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_domain', { domain: getDomainDto.domain, data: resp });
        }

        return domainExists.length > 0 ? domainExists : resp;
    }

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveDataDomainRepository.find();
        }
        return await this.saveDataDomainRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validateDomainExists(domain: string){
        return await this.saveDataDomainRepository.find({
            where: { domain: domain },
        });
    }
}
