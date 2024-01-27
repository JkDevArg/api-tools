import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Name } from './entities/name.entity';
import { NameDto } from './dto/name.dto'; 
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class NameService {
    private readonly url = process.env.NAMENA_URL;

    constructor(
        @InjectRepository(Name)
        private readonly saveDataNameRepository: Repository<Name>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async getName(getNameDto: NameDto, user: UserActiveInterface){

        const axiosPromise = axios.get(`${this.url}/?name=${getNameDto.name}`);
        const resp = await axiosErrorHandler(axiosPromise);

        const cacheNameExists = await this.cacheManager.get('data_name');

        if (cacheNameExists && cacheNameExists['name'] === getNameDto.name) {
            return cacheNameExists;
        }

        const nameExists = await this.validateNameExists(getNameDto.name);

        if (nameExists.length === 0) {
            await this.saveDataNameRepository.save({
                ...getNameDto,
                userEmail: user.email,
                data: { resp }
            });

            await this.cacheManager.set('data_name', { name: getNameDto.name, data: resp });
        }

        return nameExists.length > 0 ? nameExists : resp;
    }

    async findAll(user: UserActiveInterface) {
        if(user.role === Role.ADMIN) {
          return await this.saveDataNameRepository.find();
        }
        return await this.saveDataNameRepository.find({
          where: { userEmail: user.email },
        });
    }

    async validateNameExists(name: string){
        return await this.saveDataNameRepository.find({
            where: { name: name },
        });
    }
}
