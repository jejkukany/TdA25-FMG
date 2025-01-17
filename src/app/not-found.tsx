'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    const interval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [router])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h1 className="text-2xl font-semibold mb-4">Page Not Found</h1>
        <p className='mb-4'>Oops! The page you're looking for doesn't exist.</p>
        <p className='mb-8'>Redirecting to home page in {countdown} seconds...</p>
        <Button 
            onClick={handleGoBack}
            className="px-4 py-2 w-full bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            <p className='font-semibold'>Go Back</p>
        </Button>
      </div>
    </div>
  )
}