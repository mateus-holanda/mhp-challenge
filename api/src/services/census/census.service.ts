import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

type CensusResponse = {
  data: [['B19013_001E', 'state', 'county'], [string, string, string]]
}

@Injectable()
export class CensusService {
  private readonly apiKey: string
  private readonly apiUrl: string
  private readonly year: string
  private readonly dataset: string
  private readonly variable: string

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('census.apiKey')
    this.apiUrl = 'https://api.census.gov/data/'
    this.year = '2022' // Last Census year
    this.dataset = 'acs/acs5'
    this.variable = 'B19013_001E' // Median household income variable
  }

  public async getRegionalIncomeDataByLocation(state: string, county: string): Promise<CensusResponse> {
    try {
      const url = `${this.apiUrl}${this.year}/${this.dataset}?get=${this.variable}&in=state:${state}&for=county:${county}&key=${this.apiKey}`

      const response = await axios.get(url)
      return response
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Census API error: ${error.response.statusText}`,
          error.response.status,
        )
      } else if (error.request) {
        throw new HttpException('No response from Census API', HttpStatus.GATEWAY_TIMEOUT)
      } else {
        throw new HttpException(`Request error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
