import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class VirustotalService {
    private readonly url = process.env.URLSCAN_URL;
}
