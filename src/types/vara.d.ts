declare module 'vara' {
  interface VaraTextOptions {
    text: string;
    fontSize?: number;
    strokeWidth?: number;
    color?: string;
    duration?: number;
    textAlign?: 'left' | 'center' | 'right';
    autoAnimation?: boolean;
    queued?: boolean;
    delay?: number;
    letterSpacing?: number;
    id?: string;
    y?: number;
    x?: number;
  }

  interface VaraOptions {
    fontSize?: number;
    strokeWidth?: number;
    color?: string;
    duration?: number;
    textAlign?: 'left' | 'center' | 'right';
    autoAnimation?: boolean;
    letterSpacing?: number;
  }

  class Vara {
    constructor(
      element: HTMLElement | string,
      fontSource: string,
      texts: VaraTextOptions[],
      options?: VaraOptions
    );
    ready(callback: () => void): Vara;
    animationEnd(callback: (i: number, o: VaraTextOptions) => void): Vara;
    draw(id: string, duration?: number): void;
    erase(id: string, duration?: number): void;
    get(id: string): SVGElement | null;
  }

  export default Vara;
}
