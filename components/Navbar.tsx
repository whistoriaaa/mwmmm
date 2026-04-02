"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const navItems = [
    { label: "Portofolio", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
]

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
            <span className="text-white tracking-widest">Whistoria</span>

            <ul className="flex gap-8">
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>

                        {pathname === item.href && (
                            <motion.div
                                layoutId="activeNav"
                                className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                                transition={{type: "spring", stiffness: 300, damping: 30}}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}