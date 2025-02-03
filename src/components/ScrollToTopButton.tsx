import React, { useState, useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ScrollToTopButtonProps {
  containerId: string;
  threshold?: number;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ containerId, threshold = 300 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    containerRef.current = document.getElementById(containerId)
    
    const toggleVisibility = () => {
      if (containerRef.current) {
        setIsVisible(containerRef.current.scrollTop > threshold)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', toggleVisibility)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', toggleVisibility)
      }
    }
  }, [containerId, threshold])

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      className="fixed bottom-4 right-4 p-2 rounded-full shadow-lg transition-opacity duration-200 bg-primaryIndigo hover:bg-navyLight z-10"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  )
}

export default ScrollToTopButton

