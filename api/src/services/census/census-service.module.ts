import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CensusService } from '~/services/census/census.service'

@Module({
  providers: [CensusService, ConfigService],
  exports: [CensusService],
})
export class CensusServiceModule {}