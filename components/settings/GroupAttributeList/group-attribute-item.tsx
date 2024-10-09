import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GroupAttribute } from "@/constants/GroupAttribute/groupAttribute"

interface Props {
    groupAttribute: GroupAttribute
}

export function GroupAttributeItem({ groupAttribute }: Props) {
    const TrashIcon = Icons['trash']
    return (
        <div className="flex flex-row items-center justify-between gap-2 max-w-[300px]">
            <div className="flex flex-row gap-2 items-center">
                <Button
                    className="block !opacity-100"
                    size='icon'
                    style={{
                        backgroundColor: groupAttribute.color,
                    }}
                    variant='outline'
                    disabled
                >
                    <div />
                </Button>
                <p>{groupAttribute.title}</p>
            </div>
            <Button className="bg-transparent">
                <TrashIcon></TrashIcon>
            </Button>
        </div>
    )
}