import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class IncomeEntity {
  constructor(partial: Partial<IncomeEntity>) {
    Object.assign(this, partial)
  }

  @ApiProperty({ description: 'Average income at the location of the user'})
  @IsNumber()
  @Min(0)
  regionalIncomeAvg: number

  @ApiProperty({ description: 'User income ranking as percentage of the average income at his location'})
  @IsNumber()
  @Min(0)
  userIncomeRanking: number
}
