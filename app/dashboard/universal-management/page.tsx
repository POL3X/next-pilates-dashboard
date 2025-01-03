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
import UserCard from '@/components/universal-management/UserInfo/userCard';
import { CheckIcon } from '@radix-ui/react-icons';
import { PencilIcon, XIcon } from 'lucide-react';
import { userInfoUMAction } from '@/actions/universal-management/userInfoUMAction';
import { ReceiptTab } from '@/components/universal-management/receipt/receipt-tab';
import { GroupTab } from '@/components/universal-management/groups/group-tab';
import { editUserInfoAction } from '@/actions/universal-management/editUserInfoAction';
import { UserInfo } from '@/constants/User/UserInfo';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'User', link: '/dashboard/user' }
];
export default function Page() {
    const [isEditing, setIsEditing] = useState(false)
    const [userRowSelected, setUserRowSelected] = useState<User | null>(null)
    const [refresh, setRefresh] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<UserInfo>({name: '', email: '', phone: '', status: 'ENABLE'})
    const userSessionContextType = useContext(UserSessionContext)
    const handleEdit = () => {
        setIsEditing(!isEditing)
    }
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userRowSelected == null || userSessionContextType.userSession == null || userSessionContextType.userSession.selectedCompany == undefined) {
                return
            }
            const userInfo = await userInfoUMAction(userRowSelected?.uuid, userSessionContextType.userSession.selectedCompany)
            setUser(userInfo)
        }
        fetchUserInfo()
    }, [userRowSelected, refresh])

      useEffect(() => {
        setUserInfo({
          name: user?.name || '',
          shortName: user?.shortName || '',
          shortSurname: user?.shortSurname || '',
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          status: user?.status || 'ENABLE',
        });
      }, [user]);
      const onClickSaveUser = async () => {
        if (userSessionContextType.userSession && user) {
                await editUserInfoAction(user.uuid, userInfo, userSessionContextType.userSession.selectedCompany);
                setIsEditing(false);
                setRefresh(Math.random());
        }
    }
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
                        <CardHeader className='pb-2 w-[420px] '>
                            <div className='flex flex-row justify-between items-center'>
                                <CardTitle>Información del usuario</CardTitle>
                                {isEditing ? (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={handleEdit}>
                                            <XIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={onClickSaveUser} style={{ marginTop: "0" }}>
                                            <CheckIcon className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="ghost" size="icon" onClick={handleEdit}>
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                )}</div>
                        </CardHeader>
                        <CardContent>
                            {userRowSelected ? <UserCard isEditing={isEditing} user={user} setRefresh={setRefresh} userInfo={userInfo} setUserInfo={setUserInfo}></UserCard> : <p>Seleccione un Usuario</p>}
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
                                    {userRowSelected ? <ReceiptTab user={user}></ReceiptTab> : <p>Seleccione un Usuario</p>}
                                </TabsContent>
                                <TabsContent value="groups" className="space-y-4">
                                    {userRowSelected ? <GroupTab userSessionContextType={userSessionContextType} userRowSelected={userRowSelected}></GroupTab> : <p>Seleccione un Usuario</p>}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
