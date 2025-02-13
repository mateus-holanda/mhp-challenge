import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsString, Min } from 'class-validator'

export class IncomeDto {
  constructor(partial: Partial<IncomeDto>) {
    Object.assign(this, partial)
  }

  @ApiProperty()
  @IsString()
  state: string

  @ApiProperty()
  @IsString()
  county: string

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value !== undefined ? parseFloat(value) * 100 : undefined))
  income: number
}
