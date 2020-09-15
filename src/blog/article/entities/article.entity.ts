import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(({ type: 'varchar', width: 80 }))
    title: string;

    @Column(({ type: 'varchar', width: 200 }))
    summary: string;

    @Column(({ type: 'mediumtext'}))
    content: string;

    @Column(({ type: 'varchar', width: 2048 }))
    url_image;

    @Column(({ type: "date" }))
    dateStart: Date = new Date;

    @Column(({ type: "date", default: null }))
    dateEnd: Date;

    @Column(({ type: 'longtext' }))
    tags: string[];

    @Column(({ type: 'tinyint' }))
    featured = false;

    @Column(({ type: 'int' }))
    accountId: number;

    @Column(({ type: 'int' }))
    channelId: number;

    @Column(({ type: 'int' }))
    categoryId: number;

    @Column({ default: 'ativo' })
    status: string;

    @Column(({ type: "datetime" }))
    createdAt: Date = new Date();

    @Column(({ type: "datetime" }))
    updatedAt: Date = new Date();
}
