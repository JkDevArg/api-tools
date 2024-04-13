import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RegisterVenue } from './entities/register.entity';
import { RegisterVenueDto } from './dto/register.dto';
import { UserAgent } from 'src/common/enums/useragent.enum';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class RegisterService {
    private readonly url = process.env.VENUE_URL;
    private axiosInstance: AxiosInstance;

    constructor(
        @InjectRepository(RegisterVenue)
        private readonly saveRegisterVenueRepository: Repository<RegisterVenue>,
        private readonly personService: PersonService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      ) {
        // Configuración de la instancia axios con el User-Agent aleatorio
        this.axiosInstance = axios.create({
            headers: {
                'User-Agent': this.getRandomUserAgent(),
            },
        });
    }

    async setRegister(setRegister: RegisterVenueDto) {
        const personData = await this.personService.getPerson();
        const genData = personData['results'][0];
        const dataSend = { 
            "city": setRegister.city ? setRegister.city : genData['location']['city'],
            "age": setRegister.age ? setRegister.age : genData['dob']['age'],
            "gender": setRegister.gender ? setRegister.gender : genData['gender'],
            "phone": setRegister.phone ? setRegister.phone : genData['phone']
        }
        const axiosPromise = this.axiosInstance.post(`${this.url}/data_insert.php`, dataSend);
        const resp = await axiosErrorHandler(axiosPromise);

        return resp;
    }

    private getRandomUserAgent(): string {
        const userAgentValues = Object.values(UserAgent);
        const randomIndex = Math.floor(Math.random() * userAgentValues.length);

        return userAgentValues[randomIndex];
    }
}
