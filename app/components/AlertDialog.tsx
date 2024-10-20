import { ReactNode } from 'react'
import { Dialog, DialogTrigger, Modal } from 'react-aria-components'

import OButton from './OButton'

interface AlertDialogProps {
  children: ReactNode
  isOpen?: boolean
  onProceed: () => void
  onCancel: () => void
}

export default function AlertDialog({
  children,
  isOpen,
  onProceed,
  onCancel,
}: AlertDialogProps) {
  return (
    <DialogTrigger isOpen={isOpen}>
      <Modal>
        <Dialog role="alertdialog">
          <>
            {children}

            <div className="mt-4 flex justify-end gap-1">
              <OButton variant="outlined" onPress={onCancel}>
                Cancel
              </OButton>

              <OButton onPress={onProceed}>Proceed</OButton>
            </div>
          </>
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
