import { faker } from '@faker-js/faker/locale/af_ZA'
import { IncomeEntity } from '~/entities/income.entity'

export const incomeFixture = (params?: Partial<IncomeEntity>) => {
  return new IncomeEntity({
    regionalIncomeAvg: params?.regionalIncomeAvg ?? faker.number.int({ min: 0 }),
    userIncomeRanking: params?.userIncomeRanking ?? faker.number.float({ min: 0 }),
  })
}
