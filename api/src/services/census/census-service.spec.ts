import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import axios from 'axios'
import { CensusService } from './census.service'

vi.mock('axios')

const mockUserInput = { state: '01', county: '001', income: 6000000 }
describe('CensusService', () => {
  let service: CensusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CensusService, ConfigService],
    }).compile()

    service = module.get<CensusService>(CensusService)
  })

  describe('getRegionalIncomeDataByLocation', () => {
    it('should return income data for a valid state and county', async () => {
      const mockResponse = {
        data: [
          ['B19013_001E', 'state', 'county'],
          ['50000', '01', '001'],
        ],
      }
      vi.mocked(axios.get).mockResolvedValue(mockResponse)

      const result = await service.getRegionalIncomeDataByLocation(mockUserInput.state, mockUserInput.county)
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error if the API response fails', async () => {
      vi.mocked(axios.get).mockRejectedValue({ response: { statusText: 'Bad Request', status: 400 } })

      await expect(service.getRegionalIncomeDataByLocation(mockUserInput.state, mockUserInput.county)).rejects.toThrow(
        'Census API error: Bad Request',
      )
    })
  })
})
