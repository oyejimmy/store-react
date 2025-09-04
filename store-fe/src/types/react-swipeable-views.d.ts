declare module 'react-swipeable-views' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface SwipeableViewsProps {
    animateHeight?: boolean;
    animateTransitions?: boolean;
    axis?: 'x' | 'x-reverse' | 'y' | 'y-reverse';
    containerStyle?: CSSProperties;
    disabled?: boolean;
    disableLazyLoading?: boolean;
    enableMouseEvents?: boolean;
    hysteresis?: number;
    ignoreNativeScroll?: boolean;
    index?: number;
    onChangeIndex?: (index: number, indexLatest: number) => void;
    onSwitching?: (index: number, type: 'move' | 'end') => void;
    onTransitionEnd?: () => void;
    resistance?: boolean;
    slideStyle?: CSSProperties;
    springConfig?: {
      duration: string;
      easeFunction: string;
      delay: string;
    };
    style?: CSSProperties;
    slideClassName?: string;
    threshold?: number;
    children?: ReactNode;
  }

  const SwipeableViews: ComponentType<SwipeableViewsProps>;
  export default SwipeableViews;
}

declare module 'react-swipeable-views-utils' {
  import { ComponentType } from 'react';
  import { SwipeableViewsProps } from 'react-swipeable-views';

  interface AutoPlayProps {
    autoplay?: boolean;
    direction?: 'incremental' | 'decremental';
    enableMouseEvents?: boolean;
    interval?: number;
    springConfig?: {
      duration: string;
      easeFunction: string;
      delay: string;
    };
    slideCount?: number;
    slideRenderer?: (params: { key: number; index: number }) => React.ReactNode;
  }

  export function autoPlay<T>(component: ComponentType<T>): ComponentType<T & AutoPlayProps>;
  
  export const autoPlayUtils: {
    constant: () => void;
    virtualize: () => void;
  };
}
