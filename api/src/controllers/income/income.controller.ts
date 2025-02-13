import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IncomeDto } from '~/dto/income.dto'
import { IncomeEntity } from '~/entities/income.entity'
import { IncomeService } from '~/services/income/income.service'

@ApiTags('income')
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  @ApiOperation({ summary: 'Get regional income data based on a location' })
  @ApiResponse({ status: HttpStatus.OK, type: IncomeEntity })
  public async getRegionalIncomeDataByLocation(@Query() { state, county, income }: IncomeDto) {
    return await this.incomeService.getRegionalIncomeDataByLocation(state, county, income)
  }
}
