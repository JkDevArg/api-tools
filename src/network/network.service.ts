import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Network } from './entities/network.entity'; 
import { NetworkDomainDto } from './dto/network.dto';  
import { Role } from 'src/common/enums/rol.enum';
@Injectable()
export class NetworkService {
    private readonly url = process.env.NETWORK_URL;

    constructor(
        @InjectRepository(Network)
        private readonly saveNetworkRepository: Repository<Network>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getNetworkDomain(getNetworkDomainDto: NetworkDomainDto, user: UserActiveInterface){

        const axiosPromise = axios.get(`${this.url}/api/dns/lookup/${getNetworkDomainDto.domain}`);
        const resp = await axiosErrorHandler(axiosPromise);

        const cacheNetworkExists = await this.cacheManager.get('data_network_domain');

        if (cacheNetworkExists && cacheNetworkExists['domain'] === getNetworkDomainDto.domain) {
            return cacheNetworkExists;
        }

        const nameExists = await this.validateNameExists(getNetworkDomainDto.domain);

        if (nameExists.length === 0) {
            await this.saveNetworkRepository.save({
                ...getNetworkDomainDto,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_network_domain', { domain: getNetworkDomainDto.domain, data: resp });
        }

        return nameExists.length > 0 ? nameExists : resp;
    }

    async getNetworkCertified(getNetworkCertifiedDto: NetworkDomainDto, user: UserActiveInterface){

        const axiosPromise = axios.get(`${this.url}/api/security/certificate/${getNetworkCertifiedDto.domain}`);
        const resp = await axiosErrorHandler(axiosPromise);

        const cacheNetworkExists = await this.cacheManager.get('data_network_certified');

        if (cacheNetworkExists && cacheNetworkExists['domain'] === getNetworkCertifiedDto.domain) {
            return cacheNetworkExists;
        }

        const nameExists = await this.validateNameExists(getNetworkCertifiedDto.domain);

        if (nameExists.length === 0) {
            await this.saveNetworkRepository.save({
                ...getNetworkCertifiedDto,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_network_certified', { domain: getNetworkCertifiedDto.domain, data: resp });
        }

        return nameExists.length > 0 ? nameExists : resp;
    }

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveNetworkRepository.find();
        }
        return await this.saveNetworkRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validateNameExists(domain: string){
        return await this.saveNetworkRepository.find({
            where: { domain: domain },
        });
    }
}
