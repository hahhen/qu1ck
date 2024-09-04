import { BellIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import {dayjs} from '@/lib/dayjs'

export default function Notifications() {

    const [notifications, setNotifications] = useState([])

    async function fetchNotifications() {
        let res = await fetch('/api/notificacoes')
        let data = await res.json()
        setNotifications(data.notificacoes)
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    <BellIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-96">
                <div className="p-1">
                    <h2 className="font-semibold mb-2">Notificações</h2>
                    <ul className="space-y-2 h-64 w-full">
                        <Virtuoso
                            className={'h-full'}
                            data={notifications}
                            itemContent={(_, notification) => (
                                <li>
                                    <div className="flex flex-col p-2 rounded text-sm border border-border">
                                        <span className='text-xs text-muted-foreground'>{dayjs(notification.criado_em).fromNow()}</span>
                                        <span>{notification.mensagem}</span>
                                    </div>
                                </li>
                            )}
                        />
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    )
}