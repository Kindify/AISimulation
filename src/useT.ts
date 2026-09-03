import { useTranslation } from "react-i18next";

/**
 * Thin wrapper around react-i18next's t() that always returns a string.
 * i18next's own signature returns a broad union type when the key is a
 * template string, which does not type-check as a React child.
 */
export function useT() {
  const { t: rawT, i18n } = useTranslation();
  const t = (key: string, fallback?: string): string =>
    rawT(key, { defaultValue: fallback ?? key }) as string;
  return { t, i18n };
}
