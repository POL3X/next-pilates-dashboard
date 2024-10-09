import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollAreaKanban } from '../ui/scroll-area-kanban';
import './style.css'

export default function PageContainerKanban({
  children,
  scrollable = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollAreaKanban className="h-[calc(100dvh-180px)] .smooth-control">
          <div className="h-full p-4 md:px-8">{children}</div>
        </ScrollAreaKanban>
      ) : (
        <div className="h-full w-full p-4 md:px-8">{children}</div>
      )}
    </>
  );
}
