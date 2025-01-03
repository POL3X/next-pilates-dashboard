import PageContainer from "@/components/layout/page-container";
import { GroupAttributeTab } from "@/components/settings/GroupAttributeTab";
import { ReceiptTypeTab } from "@/components/settings/ReceiptTypeTab";
import { UserAttributeTab } from "@/components/settings/UserAttributeTab";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {

    return (
        <PageContainer scrollable={true}>
            <Tabs defaultValue="groupAttribute" className="" orientation="vertical">
                <TabsList>
                    <TabsTrigger value="groupAttribute">Atributos de grupo</TabsTrigger>
                    <TabsTrigger value="userAttribute" >
                        Atributos de usuarios
                    </TabsTrigger>
                    <TabsTrigger value="receiptType" >
                        Tipos de recibo
                    </TabsTrigger>
                </TabsList>
                <Separator className="mt-2"></Separator>
                <TabsContent value="groupAttribute" className="space-y-4">
                <GroupAttributeTab/>
                </TabsContent>
                <TabsContent value="userAttribute" className="space-y-4">
                <UserAttributeTab></UserAttributeTab>
                </TabsContent>
                <TabsContent value="receiptType" className="space-y-4">
                <ReceiptTypeTab></ReceiptTypeTab>
                </TabsContent>
            </Tabs>
        </PageContainer>
    )
}