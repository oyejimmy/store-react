declare module 'react-swipeable-views-utils' {
  import { ComponentType } from 'react';
  import { VirtualizeProps } from 'react-swipeable-views';

  export function autoPlay<P>(component: ComponentType<P>): ComponentType<P>;
  export function virtualize(props: VirtualizeProps): JSX.Element;
  export function bindKeyboard(props: any): any;
  export { default as autoPlay } from 'react-swipeable-views-utils/lib/autoPlay';
  export { default as bindKeyboard } from 'react-swipeable-views-utils/lib/bindKeyboard';
  export { default as virtualize } from 'react-swipeable-views-utils/lib/virtualize';
  export { default as autoPlayUtils } from 'react-swipeable-views-utils/lib/autoPlay/autoPlay';
  export { default as bindKeyboardUtils } from 'react-swipeable-views-utils/lib/bindKeyboard/bindKeyboard';
  export { default as virtualizeUtils } from 'react-swipeable-views-utils/lib/virtualize/virtualize';
}
