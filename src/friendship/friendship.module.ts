import { forwardRef, Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserModule } from "src/user/user.module";
import { Friendship } from "./entities/friendship.entity";
import { FriendshipController } from "./friendship.controller";
import { FriendshipService } from "./friendship.service";
import { FriendshipRepository } from "./repositories/friendship.repository";

@Module({
  imports: [forwardRef(() => UserModule), DatabaseModule],
  controllers: [FriendshipController],
  providers: [{ useValue: Friendship, provide: "FRIENDSHIP_MODEL" }, FriendshipRepository, FriendshipService],
})
export class FriendshipModule {}
