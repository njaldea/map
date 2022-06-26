import type { Result } from './type';

function formatFull(str: string, args: any[], kwargs: Record<string, any>) {
    args = args ?? [];
    kwargs = kwargs ?? {};
    str = str.replace(/{(\d+)}/g, (match, number) => args[number] ?? match);
    for (const [key, value] of Object.entries(kwargs)) {
        str = str.replace(new RegExp(`{(${key})}`, 'g'), value);
    }
    return str;
}

export const format = (str: string, kwargs: Record<string, any>) => {
    return formatFull(str, [], kwargs);
};

const content = (async () => {
    const response = await fetch('https://unpkg.com/@nil-/map@0.0.4/ww.js');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
})();

export const request = async (url: string) => {
    const ww = new Worker(await content);
    return new Promise<Record<string, Result[]>>((resolve) => {
        ww.onmessage = (e) => resolve(e.data);
        ww.postMessage(url);
    });
};
