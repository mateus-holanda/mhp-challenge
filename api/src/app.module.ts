import { Logger, MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
import { IncomeControllerModule } from './controllers/income/income-controller.module'
import { JsonBodyMiddleware } from './middlewares/json-body.middleware'
import { configLoader } from './utils/config-loader'

const CONFIG_FILE = join(__dirname, '../config/config.yml')

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configLoader(CONFIG_FILE)] }),
    IncomeControllerModule,
  ],
  controllers: [],
  providers: [ConfigService, Logger],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonBodyMiddleware).forRoutes('*')
  }
}
