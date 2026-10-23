"use client";

import { IconButton, Media } from "@once-ui-system/core";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import styles from "./ZoomableImage.module.scss";

interface ZoomableImageProps {
  src: string;
  alt: string;
  aspectRatio: string;
  sizes: string;
  priority?: boolean;
}

/**
 * A screenshot that opens full size in a native <dialog>. Media's own `enlarge` zooms in
 * place, which clipping frames and reveal transforms break, so this renders in the top layer.
 */
export function ZoomableImage({ src, alt, aspectRatio, sizes, priority }: ZoomableImageProps) {
  const t = useTranslations("work");
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label={t("enlarge", { alt })}
        onClick={() => dialog.current?.showModal()}
      >
        <Media
          src={src}
          alt={alt}
          aspectRatio={aspectRatio}
          radius="none"
          sizes={sizes}
          priority={priority}
        />
      </button>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog natively; the click only handles the backdrop. */}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={alt}
        onClick={(event) => {
          // A click on the backdrop (the dialog itself, not its content) closes it.
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {/* Full-resolution capture; next/image would resize it for the thumbnail slot. */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: the close button and Escape cover keyboard users. */}
        <img src={src} alt={alt} className={styles.full} onClick={() => dialog.current?.close()} />
        <IconButton
          className={styles.close}
          icon="close"
          variant="secondary"
          size="m"
          aria-label={t("close")}
          onClick={() => dialog.current?.close()}
        />
      </dialog>
    </>
  );
}
