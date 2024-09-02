'use client'

import { ShoppingCart, X, ReceiptText } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'
import { atom, useAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export const sidebarOpenAtom = atom(false)

export default function Sidebar() {
    const currentPage = usePathname()

    const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    return (
        <aside
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } fixed inset-y-0 left-0 z-50 w-64 min-h-screen bg-white shadow-md transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}
        >
            <div className="flex items-center justify-between p-4 lg:hidden">
                <span className="text-xl font-semibold"><Image src={"https://qu1ck.com.br/wp-content/uploads/2023/09/logo-qu1ck-site1.png"} width={128} height={50} /></span>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <X className="h-6 w-6" />
                </Button>
            </div>
            <nav className="p-4">
                <div className='mb-5 w-full hidden lg:flex'>
                    <Image src={"https://qu1ck.com.br/wp-content/uploads/2023/09/logo-qu1ck-site1.png"} width={128} height={50} />
                </div>
                <ul className="space-y-2">
                    <li>
                        <Button variant={currentPage == "/" ? "default" : "ghost"} className="w-full justify-start" asChild>
                            <Link href="/">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Estoque
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button variant={currentPage == "/pedidos" ? "default" : "ghost"} className="w-full justify-start" asChild>
                            <Link href="/pedidos">
                                <ReceiptText className="mr-2 h-4 w-4" />
                                Pedidos
                            </Link>
                        </Button>
                    </li>
                </ul>
            </nav>
            <footer className='w-full absolute bottom-0'>
                <div className="p-4 text-center text-xs text-gray-500">
                    <span>Desenvolvido por&nbsp;</span>
                    <Link href="https://github.com/hahhen" className="text-blue-500 hover:underline">Hahhen</Link>
                </div>
            </footer>
        </aside>
    )
}