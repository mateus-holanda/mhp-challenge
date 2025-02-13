import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { Mock } from 'vitest'
import { IncomeService } from '~/services/income/income.service'
import { incomeFixture } from '~/test/fixtures/income.fixture'
import { CensusService } from '../census/census.service'

const mockUserInput = { state: '01', county: '001', income: 6000000 }
const mockResponse = {
  data: [
    ['B19013_001E', 'state', 'county'],
    ['50000', '01', '001'],
  ],
}
const mockIncome = incomeFixture({
  regionalIncomeAvg: parseFloat(mockResponse.data[1][0]),
  userIncomeRanking: mockUserInput.income / parseFloat(mockResponse.data[1][0]),
})

describe('IncomeService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  let service: IncomeService
  let censusService: CensusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CensusService,
          useValue: {
            getRegionalIncomeDataByLocation: vi.fn().mockResolvedValue(mockResponse),
          },
        },
        IncomeService,
        ConfigService,
      ],
    }).compile()

    service = module.get<IncomeService>(IncomeService)
    censusService = module.get<Record<keyof CensusService, Mock>>(CensusService)
  })

  describe('getRegionalIncomeDataByLocation', () => {
    it("should return a user's income comparison for a given location", async () => {
      await expect(
        service.getRegionalIncomeDataByLocation(mockUserInput.state, mockUserInput.county, mockUserInput.income),
      ).resolves.toMatchObject(mockIncome)
      expect(censusService.getRegionalIncomeDataByLocation).toHaveBeenCalledWith(mockUserInput.state, mockUserInput.county)
    })
  })
})
