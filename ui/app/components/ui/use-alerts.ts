// Inspired by react-hot-toast library
import { AlertDialogProps } from '@radix-ui/react-alert-dialog'
import * as React from 'react'

import type { ToastActionElement } from '~/components/ui/toast'

const ALERT_LIMIT = 10

type AlertsAlert = AlertDialogProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement | ToastActionElement[] | ((dismiss: () => void) => React.ReactNode)
}

const actionTypes = {
  ADD_ALERT: 'ADD_ALERT',
  UPDATE_ALERT: 'UPDATE_ALERT',
  REMOVE_ALERT: 'REMOVE_ALERT',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_ALERT']
      alert: AlertsAlert
    }
  | {
      type: ActionType['UPDATE_ALERT']
      alert: Partial<AlertsAlert>
    }
  | {
      type: ActionType['REMOVE_ALERT']
      alertId?: AlertsAlert['id']
    }

interface State {
  dialogs: AlertsAlert[]
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        dialogs: [action.alert, ...state.dialogs].slice(0, ALERT_LIMIT),
      }

    case 'UPDATE_ALERT':
      return {
        ...state,
        dialogs: state.dialogs.map((t) => (t.id === action.alert.id ? { ...t, ...action.alert } : t)),
      }

    case 'REMOVE_ALERT':
      if (action.alertId === undefined) {
        return {
          ...state,
          dialogs: [],
        }
      }
      return {
        ...state,
        dialogs: state.dialogs.filter((t) => t.id !== action.alertId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { dialogs: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Alert = Omit<AlertsAlert, 'id'>

function alert({ ...props }: Alert) {
  const id = genId()

  const update = (props: AlertsAlert) =>
    dispatch({
      type: 'UPDATE_ALERT',
      alert: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'REMOVE_ALERT', alertId: id })

  dispatch({
    type: 'ADD_ALERT',
    alert: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useAlerts() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    alert,
    dismiss: (alertId?: string) => dispatch({ type: 'REMOVE_ALERT', alertId }),
  }
}

export { alert, useAlerts }
