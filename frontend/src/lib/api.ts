import { supabase } from "./supabase";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
        throw new Error("Not signed in");
    }

    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.error ?? `Request failed with status ${response.status}`);
    }

    return body as T;
}
