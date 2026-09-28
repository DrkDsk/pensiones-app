export const jsonHeaders = (): HeadersInit => {
    const csrfToken = document
        .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.getAttribute('content');

    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
    };
};

export const readJson = async <T>(response: Response): Promise<T | null> => {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
};
