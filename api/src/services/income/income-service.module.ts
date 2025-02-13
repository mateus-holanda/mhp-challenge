import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CensusService } from '../census/census.service'
import { IncomeService } from './income.service'

@Module({
  providers: [IncomeService, CensusService, ConfigService],
  exports: [IncomeService],
})
export class IncomeServiceModule {}
