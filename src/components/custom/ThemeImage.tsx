'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeImage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="flex-1 flex justify-center"
    >
      {resolvedTheme === 'dark' ? (
          <Image src="/Puzzle_HomePage_white.svg" alt="Puzzles (Light Theme)" width={1000} height={1000} />
        ) : (
          <Image src="/Puzzle_HomePage.svg" alt="Puzzles (Dark Theme)" width={1000} height={1000} />
      )}
    </motion.div>
  )
}