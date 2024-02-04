import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';

@Injectable()
export class PersonService {

    private readonly url = process.env.PERSONGEN_URL;
    async getPerson(){
        const axiosPromise = axios.get(`${this.url}/?nat=ES`);
        const resp = await axiosErrorHandler(axiosPromise);

        return resp;
    }
}
