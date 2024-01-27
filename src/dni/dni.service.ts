import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { DNI } from './entities/dni.entity';
import { Repository } from 'typeorm';
import { getDniDto } from './dto/dni.dto';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import axios from 'axios';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Role } from 'src/common/enums/rol.enum';
@Injectable()
export class DniService {
    private readonly key = process.env.DNI_TOKEN;
    private readonly url = process.env.DNI_URL;

    constructor(
        @InjectRepository(DNI)
        private readonly saveDataDniRepository: Repository<DNI>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getDataDni(getDataDni: getDniDto, user: UserActiveInterface){
        const axiosPromise = axios.get(`${this.url}/dni/${getDataDni.dni}?token=${this.key}`);
        const resp = await axiosErrorHandler(axiosPromise);


        const cacheDniExists = await this.cacheManager.get('data_dni');

        if (cacheDniExists && cacheDniExists['dni'] === getDataDni.dni) {
            return cacheDniExists;
        }

        const dniExists = await this.validateDniExists(getDataDni.dni);

        if (dniExists.length === 0) {
            await this.saveDataDniRepository.save({
                ...getDataDni,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_dni', { dni: getDataDni.dni, data: resp });
        }

        return dniExists ? dniExists : resp;
    }

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveDataDniRepository.find();
        }
        return await this.saveDataDniRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validateDniExists(dni: number){
        return await this.saveDataDniRepository.find({
            where: { dni: dni },
        });
    }
}
