import { Module } from "@nestjs/common";
import { GlobalConfig } from "./entities/global_config.entity";
import { GlobalConfigService } from "./global_config.service";
import { GlobalConfigRepository } from "./repositories/global-config.repository";

@Module({
  controllers: [],
  providers: [{ useValue: GlobalConfig, provide: "GLOBAL_CONFIG_MODEL" }, GlobalConfigRepository, GlobalConfigService],
})
export class GlobalConfigModule {}
