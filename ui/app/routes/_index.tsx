import { zodResolver } from '@hookform/resolvers/zod'
import { IncomeEntity } from '@mhp/api/src/entities/income.entity'
import { json, type MetaFunction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { getValidatedFormData, useRemixForm } from 'remix-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { ApiError, withApi } from '~/lib/api.server'
import { cn, formatToCurrency } from '~/lib/utils'
import { County, State, US_FIPS_CODE } from '~/utils/us-states'

export const meta: MetaFunction = () => [{ title: 'My Home Pathway' }]

const formSchema = z.object({
  state: z.string({ message: 'Please, select your state' }),
  county: z.string({ message: 'Please, select your county' }),
  income: z.coerce.number({ message: 'Income must be a number' }).nonnegative({ message: 'Income must be positive' }),
})

type FormData = z.infer<typeof formSchema>
const resolver = zodResolver(formSchema)

export const loader = withApi(async () => {
  return json({})
})

export const action = withApi(async ({ api, request }) => {
  const { errors, data, receivedValues: defaultValues } = await getValidatedFormData<FormData>(request.clone(), resolver)

  if (errors) {
    return json({ success: false, errors, data: null, defaultValues })
  }

  const { state, county, income } = data

  try {
    const { data, status } = await api.get<IncomeEntity>(
      `income?state=${US_FIPS_CODE[state as State].code}&county=${county}&income=${income}`,
      { throwsError: false },
    )

    if (status < 200 || status > 399) {
      return json({ success: false, data: null })
    }

    return json({ success: true, errors: null, data })
  } catch (err) {
    if (err instanceof ApiError) {
      return json({ success: false, data: null })
    }
    return json({ success: false, data: null })
  }
})

export default function Index() {
  const fetcher = useFetcher<typeof action>()

  const form = useRemixForm<FormData>({
    resolver,
    fetcher,
  })

  useEffect(() => {
    if (form.formState.isSubmitting || !form.formState.isSubmitSuccessful) {
      return
    }

    if (!form.formState.isSubmitSuccessful) {
      toast.error('Failed to get your income comparison')
    }
  }, [form.formState.isSubmitting, form.formState.isSubmitSuccessful])

  const state = form.watch('state')
  const county = form.watch('county')
  const income = form.watch('income')

  const counties = state && US_FIPS_CODE[state as State]?.counties

  return (
    <div className="flex flex-col w-full h-full px-8 md:px-24 items-center">
      <img
        src="/assets/img/my-home-pathway-logo.png"
        alt="My Home Pathway's Logo"
        className="md:absolute top-0 left-20 flex justify-center my-12 w-48"
      />
      <div className="flex flex-col gap-5 md:mt-12 items-center text-center md:w-1/2">
        <div className="flex flex-col gap-4">
          <h1 className="text-primary-neutral font-extrabold text-2xl md:text-5xl">
            Find out how your income compares to the average in your region! 💰📊
          </h1>
          <span className="text-blue-60 font-semibold text-xs md:text-base">
            Compare your earnings with others around you and see where you stand in the local economic landscape.
          </span>
        </div>
        <Form {...form}>
          <form className="flex flex-col w-full gap-8 md:mt-12 md:w-fit py-6" onSubmit={form.handleSubmit} method="POST">
            <div className="flex flex-col w-full gap-4 items-center">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        value={state}
                        onValueChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      >
                        <SelectTrigger className="w-96 text-sm font-medium text-blue-100 disabled:cursor-default">
                          <SelectValue placeholder="Select your state" defaultValue={field.value} />
                        </SelectTrigger>
                        <SelectContent className="bg-background-paper">
                          {Object.keys(US_FIPS_CODE).map((state) => (
                            <SelectItem key={state} value={state} className="hover:bg-background-header cursor-pointer">
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        value={county}
                        onValueChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-96 text-sm font-medium text-blue-100 disabled:cursor-default',
                            !state && 'pointer-events-none opacity-50',
                          )}
                        >
                          <SelectValue placeholder="Select your county" defaultValue={field.value} />
                        </SelectTrigger>
                        <SelectContent className="bg-background-paper">
                          {counties &&
                            counties.map((county: County) => (
                              <SelectItem key={county.name} value={county.code} className="hover:bg-background-header cursor-pointer">
                                {county.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="income"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        disabled={form.formState.isSubmitting}
                        adornment="$"
                        adornmentClassName="text-primary-neutral font-semibold text-2xl"
                        className={cn(
                          'w-96 disabled:cursor-default',
                          form.formState.errors.income && 'border-2 border-red-600 focus-visible:ring-0',
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting || !(state && county && income)}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit
            </Button>
          </form>
        </Form>

        {fetcher.data?.success ? (
          <div className="flex flex-col gap-4 md:gap-2 text-blue-60 items-center">
            <p className="flex flex-col md:flex-row gap-2 items-center">
              The average income of a person in your region is
              <span className="text-primary-neutral font-extrabold text-2xl">{formatToCurrency(fetcher.data.data?.regionalIncomeAvg)}</span>
            </p>
            <p className="flex flex-col md:flex-row gap-2 items-center">
              Your income is
              <span
                className={cn(
                  'font-extrabold text-2xl text-danger-neutral',
                  fetcher.data.data && fetcher.data.data.userIncomeRanking > 50 && 'text-warning-neutral',
                  fetcher.data.data && fetcher.data.data?.userIncomeRanking > 100 && 'text-primary-neutral',
                )}
              >
                {fetcher.data.data?.userIncomeRanking.toFixed(1)}%
              </span>
              of the average in your region
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
