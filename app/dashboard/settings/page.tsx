import PageContainer from "@/components/layout/page-container";
import { GroupAttributeTab } from "@/components/settings/GroupAttributeTab";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupTab } from "@/components/universal-management/groups/group-tab";
import { ReceiptTab } from "@/components/universal-management/receipt/receipt-tab";

export default function Page() {

    return (
        <PageContainer scrollable={true}>
            <Tabs defaultValue="groupAttribute" className="" orientation="vertical">
                <TabsList>
                    <TabsTrigger value="groupAttribute">Atributos de grupo</TabsTrigger>
                    <TabsTrigger value="userAttribute" >
                        Atributos de usuarios
                    </TabsTrigger>
                </TabsList>
                <Separator className="mt-2"></Separator>
                <TabsContent value="groupAttribute" className="space-y-4">
                <GroupAttributeTab/>
                </TabsContent>
                <TabsContent value="userAttribute" className="space-y-4">
                </TabsContent>
            </Tabs>
        </PageContainer>
    )
}