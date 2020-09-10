import { IsString, IsNotEmpty, IsEmail, IsNumber, IsDate, IsBoolean } from 'class-validator';
import * as moment from 'moment';

export class AuthPayload {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    level: string;

    @IsNotEmpty()
    @IsDate()
    exp: number;

    @IsNotEmpty()
    @IsDate()
    rnw: number;

    @IsNotEmpty()
    @IsBoolean()
    remember: boolean;

    constructor(payload: AuthPayload) {
        Object.assign(this, payload);
    }

    public isAllowToRenewal(): boolean {
        const currentDate = moment().unix();
        
        return this.rnw > currentDate;
    }

}
