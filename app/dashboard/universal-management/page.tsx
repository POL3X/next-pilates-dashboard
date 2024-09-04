'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import { UserClient } from '@/components/tables/user-tables/client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { users } from '@/constants/data';
import { User } from '@/constants/User/user';
import { userListUMAction } from '@/actions/universal-management/userListUMAction';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import UserSessionContext from '@/components/layout/context/user-session';
import { PaginationState } from '@tanstack/react-table';
import { UniversalManagementClientTable } from '@/components/tables/universal-management/UM-client-table';
import UserCard from '@/components/test/test';
import { CheckIcon } from '@radix-ui/react-icons';
import { PencilIcon } from 'lucide-react';




const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'User', link: '/dashboard/user' }
];
export default function page() {
    const [isEditing, setIsEditing] = useState(false)
    const handleEdit = () => {
        setIsEditing(!isEditing)
    }


    return (
        <PageContainer scrollable={true}>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr]">
                <Card className="w-full">
                    <CardHeader>
                    </CardHeader>
                    <CardContent>
                        <UniversalManagementClientTable />
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
                            <UserCard isEditing={isEditing}></UserCard>
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
