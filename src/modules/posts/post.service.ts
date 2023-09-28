import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Posts } from "./models/post.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>
  ) {}

  async getOnePost() {

  }
}
