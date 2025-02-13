import { Injectable } from '@nestjs/common'
import { IncomeEntity } from '~/entities/income.entity'
import { CensusService } from '../census/census.service'

@Injectable()
export class IncomeService {
  constructor(private readonly censusService: CensusService) {}

  public async getRegionalIncomeDataByLocation(state: string, county: string, income: number) {
    const { data } = await this.censusService.getRegionalIncomeDataByLocation(state, county)

    const regionalIncomeAvg = parseFloat(data[1][0])
    const userIncomeRanking = income / regionalIncomeAvg

    return regionalIncomeAvg ? new IncomeEntity({ regionalIncomeAvg, userIncomeRanking }) : null
  }
}
