import { Test, TestingModule } from '@nestjs/testing'
import { IncomeService } from '~/services/income/income.service'
import { incomeFixture } from '~/test/fixtures/income.fixture'
import { IncomeController } from './income.controller'

const mockUserInput = { state: '01', county: '001', income: 6000000 }
const mockIncome = incomeFixture()

describe('IncomeController', () => {
  let controller: IncomeController
  let incomeService: IncomeService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeController],
      providers: [
        {
          provide: IncomeService,
          useValue: {
            getRegionalIncomeDataByLocation: vi.fn(async () => mockIncome),
          },
        },
      ],
    }).compile()

    controller = module.get<IncomeController>(IncomeController)
    incomeService = module.get<IncomeService>(IncomeService)
  })

  describe('getRegionalIncomeDataByLocation', () => {
    it("should return a user's income comparison for a given location", async () => {
      await expect(controller.getRegionalIncomeDataByLocation(mockUserInput)).resolves.toStrictEqual(mockIncome)
      expect(incomeService.getRegionalIncomeDataByLocation).toHaveBeenCalledWith(
        mockUserInput.state,
        mockUserInput.county,
        mockUserInput.income,
      )
    })
  })
})
