import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
    template: {
        dir: path.resolve(__dirname, '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
            extName: '.hbs',
            layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
        },
    },
    transport: `smtps://` +
     process.env.EMAILCONTACT_ACCOUNT + 
     process.env.EMAILCONTACT_PASSWORD  + 
     `@smtp.gmail.com`,
};