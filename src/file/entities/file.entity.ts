import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(({ type: 'int' }))
    postId: number;

    @Column(({ type: 'varchar', width: 2048 }))
    url: string;

    @Column(({ type: 'varchar', width: 255 }))
    name: string;

    @Column(({ type: 'varchar', width: 400 }))
    description: string;

    @Column(({ type: 'datetime' }))
    postedAt: Date;

    @Column(({ type: 'int' }))
    size: number;

    @Column({ default: 'ativo' })
    status: string;

    @Column(({ type: "datetime" }))
    createdAt: Date = new Date();

    @Column(({ type: "datetime" }))
    updatedAt: Date = new Date();

    @BeforeInsert()
    setPostedAt(): void {
        if (!this.postedAt) { this.postedAt = new Date() }
    }

}
