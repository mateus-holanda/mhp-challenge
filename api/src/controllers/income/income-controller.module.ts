import { Module } from '@nestjs/common'
import { IncomeServiceModule } from '~/services/income/income-service.module'
import { IncomeController } from './income.controller'

@Module({
  imports: [IncomeServiceModule],
  providers: [IncomeController],
  controllers: [IncomeController],
})
export class IncomeControllerModule {}
