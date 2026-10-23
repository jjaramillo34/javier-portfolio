"use client";

import { Text } from "@once-ui-system/core";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function VisitorCount() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/visitor-count")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { count?: number | null } | null) => {
        if (active && typeof payload?.count === "number") setCount(payload.count);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (count === null) return null;
  return (
    <Text variant="body-default-xs" onBackground="neutral-weak">
      {t("visitors", { count: count.toLocaleString(locale) })}
    </Text>
  );
}
