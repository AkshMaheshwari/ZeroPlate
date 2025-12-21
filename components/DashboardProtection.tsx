'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, onAuthChange } from '@/lib/auth'

export default function DashboardProtection({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const unsubscribe = onAuthChange(async (user) => {
                if (!user) {
                    // Not logged in, redirect to login
                    router.push('/login')
                } else {
                    // Check if user is admin
                    const admin = await isAdmin()
                    if (!admin) {
                        // Not an admin, redirect to feedback
                        router.push('/feedback')
                    }
                }
            })

            return () => unsubscribe()
        }

        checkAuth()
    }, [router])

    return <>{children}</>
}
