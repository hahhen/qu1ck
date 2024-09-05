import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex h-screen bg-gray-100 bg-pattern bg-[length:20px_20px]">
                    <Sidebar />
                    {children}
                </div>
            </body>
        </html>
    );
}
