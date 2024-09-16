'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/constants/User/user';
import { SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import UserSessionContext from '@/components/layout/context/user-session';
import { UniversalManagementClientTable } from '@/components/tables/universal-management/UM-client-table';
import UserCard from '@/components/test/test';
import { CheckIcon } from '@radix-ui/react-icons';
import { PencilIcon } from 'lucide-react';
import { userInfoUMAction } from '@/actions/universal-management/userInfoUMAction';
import { ReceiptTab } from '@/components/universal-management/receipt/receipt-tab';


const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'User', link: '/dashboard/user' }
];
export default function page() {
    const [isEditing, setIsEditing] = useState(false)
    const [userRowSelected, setUserRowSelected] = useState<User | null>(null)
    const userSessionContextType = useContext(UserSessionContext)
    const handleEdit = () => {
        setIsEditing(!isEditing)
    }
    const [user, setUser] = useState<User | null>(null)

    useEffect(()=>{
    
        const fetchUserInfo = async () => {
            if(userRowSelected == null || userSessionContextType.userSession == null || userSessionContextType.userSession.selectedCompany == undefined){
                return
            }
            const userInfo = await userInfoUMAction(userRowSelected?.uuid, userSessionContextType.userSession.selectedCompany)
            setUser(userInfo)
        }
        fetchUserInfo()
    }, [userRowSelected])


    return (
        <PageContainer scrollable={true}>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr]">
                <Card className="w-full">
                    <CardHeader>
                    </CardHeader>
                    <CardContent>
                        <UniversalManagementClientTable setUserRowSelected={setUserRowSelected} />
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 grid-rows-[1fr_3fr] gap-2">
                    <Card className="w-full ">
                        <CardHeader>
                           <div className='flex flex-row justify-between'>
                           <CardTitle>Información del usuario</CardTitle>
                            <Button variant="ghost" size="icon" onClick={handleEdit}>
                                {isEditing ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                            </Button></div> 
                        </CardHeader>
                        <CardContent>
                            <UserCard isEditing={isEditing} user={user}></UserCard>
                        </CardContent>
                    </Card>
                    <Card className="w-full ">
                        <CardContent>
                            <Tabs defaultValue="receipt" className="space-y-4 mt-6">
                                <TabsList>
                                    <TabsTrigger value="receipt">Recibos</TabsTrigger>
                                    <TabsTrigger value="groups" >
                                        Grupos
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="receipt" className="space-y-4">
                                    <ReceiptTab user={user}></ReceiptTab>
                                </TabsContent>
                                <TabsContent value="groups" className="space-y-4">
                                </TabsContent>
                            </Tabs>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </PageContainer>
    );
}
