const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export const homeHref = base;

export function termHref(id: string): string {
  return `${base}terms/${id}/`;
}
