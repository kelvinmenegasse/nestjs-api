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
    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<any> {
        return await bcrypt.compare(attempt, this.password);
    }

    isActive(): boolean {
        return this.status === 'ativo' ? true : false;
    }
}
