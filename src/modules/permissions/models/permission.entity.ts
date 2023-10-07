import { Users } from "../../../modules/users/models/user.entity";
import { BaseEntity } from "../../../common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PermissionStatuses, RoleName } from "./permission.interface";

@Entity()
export class Permissions extends BaseEntity {
  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'userId' })
  @Column({ type: 'varchar' })
  userId: string

  @Column({ type: 'varchar', default: PermissionStatuses.ACTIVE })
  status: PermissionStatuses

  @Column({ type: 'varchar' })
  roleName: RoleName
}
