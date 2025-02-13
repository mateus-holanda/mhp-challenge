/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { join } from 'path'
import config from './config.server'

type DataFunctionArgs = LoaderFunctionArgs | ActionFunctionArgs
type AppData = any

export type WithAPIDataFunctionArgs = DataFunctionArgs & { api: API }
export type WithAPIDataFunction<R = Promise<Response> | Response | Promise<AppData> | AppData> = (
  args: WithAPIDataFunctionArgs,
) => R | Promise<R>

export class ApiError extends Error {
  public status: number
  public statusText: string
  public response: Response
  constructor(message: string, response: Response) {
    super(message)
    this.response = response
    this.status = response.status
    this.statusText = response.statusText
  }
}

export interface Options extends Omit<RequestInit, 'body' | 'headers'> {
  headers?: Record<string, string>
  body?: Record<string, unknown> | FormData
  json?: boolean
  throwsError?: boolean
}

const baseUrl = `${typeof process !== 'undefined' ? config.get('api.baseUrl') : ''}`

export class API {
  protected authCookie: string | null = null

  constructor(request: Request) {
    this.authCookie = `${request.headers.get('cookie')}`
  }

  protected async request<T = any>(route: string, { body, ...options }: Options = {}) {
    const headers: Record<string, string> =
      options.json !== false ? { ...(options.headers ?? {}), 'Content-Type': 'application/json' } : (options.headers ?? {})

    if (this.authCookie) {
      headers.cookie = this.authCookie
    }

    let response

    try {
      response = await fetch(join(baseUrl, route), {
        body: options.json !== false ? JSON.stringify(body) : (body as never),
        headers,
        ...options,
      })
    } catch (err: any) {
      if (err.message.includes('ECONNREFUSED')) {
        throw new Error('Unable to reach API server')
      }
      throw err
    }
    const status = response.status
    const isJsonResponse = response.headers.get('content-type')?.includes('json')

    // throw error if the status code is non 200/300 only if the throwsError is not false
    if (options?.throwsError !== false && (status < 200 || status >= 400)) {
      const text = await response.text()
      throw new ApiError(text, response)
    }

    const data: T = isJsonResponse ? await response.json() : await response.text()

    return { data, response, status }
  }

  public async get<T = any>(route: string, options?: Options) {
    return this.request<T>(route, options)
  }
}

/**
 * A wrapper for the a loader or action to provide an authenticated API that passes the token to the API request.
 *
 * Usage:
 * ```ts
 * export const loader = withApi(async ({ api }) => { ... })
 * ```
 * _Note: Typings are automatically added to your callback_
 */
export const withApi = <R>(callback: WithAPIDataFunction<R>): WithAPIDataFunction<R> => {
  return async (loaderActionArgs: DataFunctionArgs) => {
    const api = new API(loaderActionArgs.request)
    return await callback({ ...loaderActionArgs, api })
  }
}
