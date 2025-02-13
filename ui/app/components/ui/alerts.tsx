import { ToastProvider, ToastViewport } from '~/components/ui/toast'
import { useAlerts } from '~/components/ui/use-alerts'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog'

export function Alerts() {
  const { dialogs, dismiss } = useAlerts()

  return (
    <ToastProvider>
      {dialogs.map(function ({ id, title, description, action, ...props }) {
        return (
          <AlertDialog key={id} open {...props}>
            <AlertDialogContent>
              <AlertDialogHeader>
                {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}
                {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
              </AlertDialogHeader>
              <AlertDialogFooter>{typeof action === 'function' ? action(() => dismiss(id)) : action}</AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
