import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./models/post.entity";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
