'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 70;
const DEFAULT_DISTANCE = 140;
const DEFAULT_PANEL_HEIGHT = 70;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

type DockLabelProps = {
  children: React.ReactNode;
  className?: string;
};

type DockIconProps = {
  children: React.ReactNode;
  className?: string;
  width?: MotionValue<number>;
  theme?: string;
};

type DocContextType = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 180, damping: 15 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const { theme } = useTheme();
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height: height,
        scrollbarWidth: 'none',
      }}
      className='mx-2 flex max-w-full items-end overflow-x-auto'
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          'mx-auto flex w-fit gap-3 rounded-2xl px-4 shadow-lg',
          theme === 'dark' 
            ? 'bg-card/80 border border-border backdrop-blur-md' 
            : 'bg-white/90 border border-gray-200 backdrop-blur-sm',
          className
        )}
        style={{ height: panelHeight }}
        role='toolbar'
        aria-label='Application dock'
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, href }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const { distance, magnification, mouseX, spring } = useDock();

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [45, magnification, 45]
  );

  const width = useSpring(widthTransform, spring);

  // Apply theme classes to children
  const themedChildren = Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Pass width and theme as props to DockIcon components
      return React.cloneElement(child, { 
        width,
        theme 
      } as Partial<DockIconProps>);
    }
    return child;
  });

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer rounded-xl transition-colors',
        theme === 'dark' 
          ? 'hover:bg-card/50' 
          : 'hover:bg-gray-100/50',
        className
      )}
      tabIndex={0}
      role='button'
      aria-haspopup='true'
      onClick={handleClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {themedChildren}
    </motion.div>
  );
}

function DockLabel({ children, className }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // For simplicity, we'll show the label on hover of the parent DockItem
  // In a real implementation, you might want to use context or props to control this
  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const parent = ref.current?.parentElement;
    if (parent) {
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md px-2 py-1 text-xs font-medium shadow-sm',
            theme === 'dark' 
              ? 'bg-card border border-border text-foreground' 
              : 'bg-white border border-gray-200 text-gray-900',
            className
          )}
          role='tooltip'
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, theme }: DockIconProps) {
  return (
    <div className={cn(
      'flex items-center justify-center transition-all duration-200',
      theme === 'dark' 
        ? 'text-foreground' 
        : 'text-gray-900',
      className
    )}>
      {children}
    </div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };