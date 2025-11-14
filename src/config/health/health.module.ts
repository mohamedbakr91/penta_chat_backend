import { Logger, Module } from "@nestjs/common";
import { HttpHealthIndicator, TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    HttpHealthIndicator,
    {
      provide: "TERMINUS_LOGGER",
      useValue: Logger,
    },
  ],
})
export class HealthModule {}
