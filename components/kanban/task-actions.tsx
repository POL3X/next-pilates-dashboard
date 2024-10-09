import { Task } from "@/lib/store"
import { Icons } from "../icons"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { id } from "date-fns/locale"
import { toast } from "../ui/use-toast"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { makeActionUserGroupAction } from "@/actions/Kanban/makeActionUserGroupAction"
import UserSessionContext from "../layout/context/user-session"
import KanbanRefreshContext from "../layout/context/kanban-refresh-context"

interface Props{
    task: Task,
}

const  userAction = async (task: Task, action: string, selectedCompany?: string) => {
    await makeActionUserGroupAction(task,  action, selectedCompany)
}

export function TaskActions({task}: Props){
    const MoveUpIcon = Icons['arrowUp']
    const MoveDownIcon = Icons['arrowDown']
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showOutWaitDialog, setShowOutWaitDialog] = useState(false);
    const userSession = useContext(UserSessionContext)
    const kanbanRefreshContext = useContext(KanbanRefreshContext)
    const TrashIcon = Icons['trash']

    return (
        <><div className="flex flex-row ">
            {task.waitList ?
                <Button variant={"secondary"} size={"sm"} className="bg-transparent p-2"  onClick={() => setShowOutWaitDialog(true)}><MoveUpIcon className="size-3"></MoveUpIcon></Button>
                :
                <></>}

            <Button variant={"secondary"} size={"sm"} className="bg-transparent" onClick={() => setShowDeleteDialog(true)}><TrashIcon className="size-3"></TrashIcon></Button>
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           ¿Seguro que quieres quitar al usuario del grupo?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            NOTE: Para eliminar el grupo debes quitar a todos los usuarios.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // yes, you have to set a timeout
                                userAction(task, 'DELETE', userSession.userSession?.selectedCompany)
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100)
                                kanbanRefreshContext.setRefresh(Math.random)
                                setShowDeleteDialog(false)
                                toast({
                                    description: 'El usuario se ha quitado del grupo.'
                                })
                            } }
                        >
                            Quitar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showOutWaitDialog} onOpenChange={setShowOutWaitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                           Sacar al usuario de lista de espera.
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            NOTE: Esta acción movera al usuario dentro del grupo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="default"
                            onClick={() => {
                                // yes, you have to set a timeout
                                userAction(task, 'UPDATE_OUT_WAITLIST',userSession.userSession?.selectedCompany)
                                setTimeout(() => (document.body.style.pointerEvents = ''), 100)
                                kanbanRefreshContext.setRefresh(Math.random)
                                setShowOutWaitDialog(false)
                                toast({
                                    description: 'El usuario se ha quitado de la lista de espera.'
                                })
                            } }
                        >
                            Mover
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            </>
    )
}