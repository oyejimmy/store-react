declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
    backgroundColor?: string | null;
    imageTimeout?: number;
    removeContainer?: boolean;
    foreignObjectRendering?: boolean;
    ignoreElements?: (element: Element) => boolean;
    onclone?: (document: Document) => void;
  }

  function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;

  export = html2canvas;
}
