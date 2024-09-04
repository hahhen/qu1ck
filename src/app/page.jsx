"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, ShoppingCart, Users, BarChart, Menu, X, ListRestart, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { sidebarOpenAtom } from "@/components/ui/sidebar"
import { useAtom } from "jotai"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Notifications from "@/components/ui/notifications"

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const [ingredientes, setIngredientes] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchIngredientes() {
    setLoading(true)
    let res = await fetch('/api/consulta_estoque')
    let data = await res.json()
    setIngredientes(data.estoque)
    setLoading(false)
  }

  useEffect(() => {
    fetchIngredientes()
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with burger menu */}
      <header className="bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <Notifications />
          </div>
          <h1 className="text-xl font-semibold">Estoque</h1>

        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
        <div className="flex justify-between mb-4 items-end">
          <h1 className="text-2xl font-semibold hidden lg:block">Estoque</h1>
          <div className="flex items-center gap-2">
            {loading && <svg class="w-4 h-4 text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
              </path>
            </svg>}
            <Button size="sm" variant="outline" className={loading && "opacity-50"} onClick={fetchIngredientes}><RefreshCcw size={15} />&nbsp;Atualizar</Button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[100px]">Quantidade</TableHead>
                  <TableHead className="text-right">Atualizado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={`overflow-auto transition-all ${loading && "opacity-50"}`}>
                {ingredientes.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.ingrediente}</TableCell>
                    {
                      product.quantidade <= product.quantidade_reserva ?
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableCell class="p-2 flex items-center">
                                <div className={"bg-destructive p-2 text-destructive-foreground rounded"}>
                                  {product.quantidade}&nbsp;{product.unidade_medida}
                                </div>
                              </TableCell>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Estoque acabando</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        :
                        <TableCell>{product.quantidade}&nbsp;{product.unidade_medida}</TableCell>
                    }
                    <TableCell className="text-right">{formatDate(product.atualizado_em)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}