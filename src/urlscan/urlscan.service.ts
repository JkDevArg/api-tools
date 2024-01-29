import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Role } from 'src/common/enums/rol.enum';
import { URLSCAN } from './entities/urlscan.entity';
import { getUrlScanDto } from './dto/urlscan.dto';

@Injectable()
export class UrlscanService {
    private readonly url = process.env.URLSCAN_URL;

    constructor(
        @InjectRepository(URLSCAN)
        private readonly saveUrlScanRepository: Repository<URLSCAN>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getUrlScan(getUrlScan: getUrlScanDto, user: UserActiveInterface){
        const axiosPromise = axios.get(`${this.url}/?q=domain:${getUrlScan.url}`);
        const resp = await axiosErrorHandler(axiosPromise);

        const cacheUrlScanExists = await this.cacheManager.get('data_scan_url');

        if (cacheUrlScanExists && cacheUrlScanExists['url'] === getUrlScan.url) {
            return cacheUrlScanExists;
        }

        const urlScanExists = await this.validateUrlExists(getUrlScan.url);

        if (urlScanExists.length === 0) {
            await this.saveUrlScanRepository.save({
                ...getUrlScan,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_scan_url', { url: getUrlScan.url, data: resp });
        }

        return urlScanExists.length > 0 ? urlScanExists : resp;
    }

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveUrlScanRepository.find();
        }
        return await this.saveUrlScanRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validateUrlExists(url: string){
        return await this.saveUrlScanRepository.find({
            where: { url: url },
        });
    }
}
