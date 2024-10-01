declare class QRCode {
    constructor(container: HTMLElement, options: {
        text: string;
        width: number;
        height: number;
        colorDark?: string;
        colorLight?: string;
        correctLevel?: number;
        version?: number;
    });

    makeCode(text: string): void; // Optional, if you want to call makeCode() directly
}
