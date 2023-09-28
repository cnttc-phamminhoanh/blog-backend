import { BaseEntity } from "../../../common/base.entity";
import { Column, Entity } from "typeorm";
import { UserStatuses } from "./user.interface";

@Entity()
export class Users extends BaseEntity {
  @Column({ type: 'varchar'})
  email: string

  @Column({ type: 'varchar' })
  password?: string

  @Column({ type: 'varchar', nullable: true })
  firstName: string

  @Column({ type: 'varchar', nullable: true })
  lastName: string

  @Column({ type: 'varchar', default: UserStatuses.INACTIVE })
  status: UserStatuses;
}
