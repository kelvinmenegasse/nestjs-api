import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Article } from 'src/blog/article/entities/article.entity';

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(({ type: 'varchar', width: 255 }))
    username: string;

    @Column(({ type: 'varchar', width: 255 }))
    email: string;
    
    @Column(({ type: 'varchar', width: 255 }))
    password;

    @Column(({ type: 'varchar', width: 255 }))
    fullname;
    
    @Column(({ type: 'varchar', width: 255 }))
    level;

    @Column(({ type: 'varchar', width: 255, nullable: true }))
    recoveryKey;

    @Column(({ type: 'datetime', nullable: true }))
    lastLoginDate;
  
    @Column(({ type: "datetime" }))
    createdAt: Date = new Date();
  
    @Column(({ type: "datetime" }))
    updatedAt: Date = new Date();

    @Column({ default: 'ativo'})
    status: string;

    @OneToMany(type => Article, article => article.account)
    articles: Article[]
  
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
