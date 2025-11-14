import { Controller, Get, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HttpHealthIndicator } from "@nestjs/terminus";

@Controller("health")
@ApiTags("App Health Checker")
@ApiBearerAuth("JWT")
export class HealthController {
  private logger = new Logger(HealthController.name);
  constructor(private http: HttpHealthIndicator) {}

  @HealthCheck()
  @Get()
  check() {
    this.logger.log(`Checking Health`);
    return this.http.pingCheck("nestjs-docs", "https://docs.nestjs.com");
  }
}
