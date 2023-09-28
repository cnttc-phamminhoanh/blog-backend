import { BaseEntity } from "../../../common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PostStatuses } from "./post.interface";
import { Users } from "../../../modules/users/models/user.entity";

@Entity()
export class Posts extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  title: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string

  @Column({ type: 'varchar', default: PostStatuses.PUBLIC })
  status: PostStatuses;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'userId' })
  @Column({ type: 'varchar' })
  userId: string
}
