'use client'
import React from 'react'
import {useRouter} from 'next/navigation'

import {removeMember} from '@/database/services/group.actions'
import {Answer} from '@/database/types/answer.type'

import InfoBox from '@/components/_Atoms/boxes/info-box'
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DbAwnserBox from '@/components/_Atoms/boxes/db-answer-box'

import {Loader2} from 'lucide-react'
import {IoIosWarning} from 'react-icons/io'
import {IoClose} from 'react-icons/io5'

/**
 * @version 1
 * @description Diálogo para eliminar un miembro de un grupo
 * @param groupId  Id del grupo al que se envía la solicitud
 * @param userId  Id del usuario a eliminar
 * @param isOpen  Estado de apertura del diálogo
 * @param onOpenChange  Función para cambiar el estado de apertura del diálogo
 */

export default function RemoveMemberDialog({
  userId,
  groupId,
  isOpen,
  onOpenChange,
}: {
  userId: string | null
  groupId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [dbAnswer, setDbAnswer] = React.useState<Answer | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const handleAccept = () => {
    setDbAnswer(null)
    startTransition(async () => {
      const answer = await removeMember(groupId, userId)
      if (answer.ok) {
        setDbAnswer(null)
        onOpenChange(false)
        router.refresh()
      } else {
        setDbAnswer(answer)
      }
    })
  }

  const handleReject = () => {
    setDbAnswer(null)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="bg-card w-[460px] max-w-[90%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IoClose />
            Eliminar miembro
          </DialogTitle>
        </DialogHeader>
        <InfoBox
          title="¿Estás seguro?"
          color="destructive"
          icon={<IoIosWarning />}
        >
          Esta acción es irreversible
        </InfoBox>

        <DbAwnserBox answer={dbAnswer} />
        <DialogFooter className="mt-6">
          <Button
            disabled={isPending}
            variant="outline"
            onClick={handleReject}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Rechazar
          </Button>
          <Button
            disabled={isPending}
            onClick={handleAccept}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
