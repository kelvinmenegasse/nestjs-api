import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base-entity';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Account extends BaseEntity {

    @Column(({ type: 'varchar', width: 255, nullable: true }))
    recoveryKey;

    @Column(({ type: 'datetime', nullable: true }))
    lastLoginDate;

    @Column(({ type: 'varchar', width: 255 }))
    level;

    @Column(({ type: 'varchar', width: 255 }))
    fullname;

    @Column(({ type: 'varchar', width: 255 }))
    password;

    @Column(({ type: 'varchar', width: 255 }))
    username: string;

    @Column(({ type: 'varchar', width: 255 }))
    email: string;

    @PrimaryGeneratedColumn()
    accountID: number;

    @BeforeInsert()
    async hashPassword(newPassword: string = null): Promise<void> {
        this.password = newPassword !== null ? newPassword : this.password;

        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<any> {
        return await bcrypt.compare(attempt, this.password);
    }

    async generateRecoveryKey(length = 10): Promise<void> {
        let generatedPassword = '';

        const charPossible = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
        for (let i = 0; i < length; i++) {
          generatedPassword += charPossible.charAt(Math.floor(Math.random() * charPossible.length));
        }

        this.recoveryKey = generatedPassword;
    }

    isActive(): boolean {
        return this.status === 'ativo' ? true : false;
    }
}
