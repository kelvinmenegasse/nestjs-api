import { Column } from "typeorm";

export abstract class BaseEntity {

  @Column({ default: 'ativo'})
  status: string;

  @Column(({ type: "datetime" }))
  createdAt: Date = new Date();

  @Column(({ type: "datetime" }))
  updatedAt: Date = new Date();

}
