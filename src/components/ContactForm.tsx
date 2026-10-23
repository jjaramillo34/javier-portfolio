"use client";

import { ValidationError, useForm } from "@formspree/react";
import { Button, Column, Icon, Input, Row, Text, Textarea } from "@once-ui-system/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function Form({ formId }: { formId: string }) {
  const t = useTranslations("contact");
  const [state, handleSubmit] = useForm(formId);
  const [captcha, setCaptcha] = useState<string | null>(null);
  // reCAPTCHA rejects localhost, so it is only shown on real hosts.
  const [showCaptcha, setShowCaptcha] = useState(false);

  useEffect(() => {
    const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    setShowCaptcha(Boolean(RECAPTCHA_SITE_KEY) && !local);
  }, []);

  if (state.succeeded) {
    return (
      <Column
        background="success-alpha-weak"
        border="success-alpha-medium"
        radius="l"
        padding="24"
        gap="8"
      >
        <Row gap="8" vertical="center">
          <Icon name="check" onBackground="success-medium" />
          <Text variant="heading-strong-s">{t("successTitle")}</Text>
        </Row>
        <Text onBackground="neutral-weak">{t("success")}</Text>
      </Column>
    );
  }

  const hasError = Array.isArray(state.errors) ? state.errors.length > 0 : Boolean(state.errors);

  return (
    <form onSubmit={handleSubmit}>
      <Column fillWidth gap="16">
        <Input id="name" name="name" label={t("name")} autoComplete="name" required />
        <Input
          id="email"
          name="email"
          type="email"
          label={t("email")}
          autoComplete="email"
          required
        />
        <ValidationError field="email" prefix={t("email")} errors={state.errors} />
        <Textarea
          id="message"
          name="message"
          label={t("message")}
          placeholder={t("messagePlaceholder")}
          lines={5}
          required
        />
        {showCaptcha && RECAPTCHA_SITE_KEY && (
          <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptcha} />
        )}
        {hasError && (
          <Text variant="body-default-s" onBackground="danger-medium" role="alert">
            {t("error")}
          </Text>
        )}
        <Row data-border="rounded">
          <Button
            type="submit"
            suffixIcon="send"
            loading={state.submitting}
            disabled={state.submitting || (showCaptcha && !captcha)}
          >
            {t("send")}
          </Button>
        </Row>
      </Column>
    </form>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!formId) {
    return (
      <Text variant="body-default-m" onBackground="neutral-weak">
        {t("notConfigured")}
      </Text>
    );
  }
  return <Form formId={formId} />;
}
