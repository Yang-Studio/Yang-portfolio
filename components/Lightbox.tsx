'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'

export type LightboxImage = {
  src: string
  alt: string
  title?: string
  caption?: string
}

type Props = {
  open: boolean
  image?: LightboxImage
  onClose: () => void
}

export default function Lightbox({ open, image, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  return (
    <AnimatePresence>
      {open && image ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-6 top-6 rounded-full bg-sand/90 p-2 text-slate shadow-soft"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <X aria-label="Close lightbox" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="glass max-h-[86vh] w-[92vw] max-w-6xl overflow-hidden rounded-2xl border border-coral/30 shadow-glow"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1600}
              height={1200}
              className="max-h-[78vh] w-full object-contain"
            />
            {(image.title || image.caption) && (
              <div className="bg-sand/90 p-4 text-slate">
                {image.title && <h3 className="font-display text-lg">{image.title}</h3>}
                {image.caption && <p className="text-sm text-slate/80">{image.caption}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
