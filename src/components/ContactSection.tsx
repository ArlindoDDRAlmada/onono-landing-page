"use client";

import React, { useState, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";
import { api } from "@/lib/api";

const ContactSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // immediateRender: false on every triggered from() — otherwise a late
        // ScrollTrigger.refresh (font/image load) reverts elements to the
        // cached hidden from-state and they stay invisible.
        const ir = { immediateRender: false };

        // Header: masked line reveal
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".contact-header", start: "top 78%" },
          })
          .from(".contact-label", { y: 20, opacity: 0, duration: 0.6, ...ir })
          .from(
            ".contact-line",
            { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out", ...ir },
            "-=0.3"
          )
          .from(".contact-desc", { y: 30, opacity: 0, duration: 0.8, ...ir }, "-=0.5");

        // Info column: staggered items
        gsap.from(".contact-info-item", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".contact-info-col", start: "top 80%" },
        });

        // Form: drift in from the right, fields rise
        gsap.from(".contact-form-col", {
          x: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".contact-form-col", start: "top 80%" },
        });
        gsap.from(".contact-field", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".contact-form-col", start: "top 75%" },
        });
      });
    },
    { scope: sectionRef }
  );

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.infoEmailTitle"),
      content: "administrative@onono-technologies.com",
      subtitle: t("contact.infoEmailSubtitle"),
      action: "mailto:administrative@onono-technologies.com",
    },
    {
      icon: Phone,
      title: t("contact.infoPhoneTitle"),
      content: "+244 929 976 519",
      subtitle: t("contact.infoPhoneSubtitle"),
      action: "tel:+244929976519",
    },
    {
      icon: MapPin,
      title: t("contact.infoLocationTitle"),
      content: "Rua Eduardo Mondlane, nº 25, Ingombotas, Luanda",
      subtitle: t("contact.infoLocationSubtitle"),
      action: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: t("contact.infoHoursTitle"),
      content: t("contact.infoHoursContent"),
      subtitle: t("contact.infoHoursSubtitle"),
      action: null,
    },
  ];

  const services = [
    t("services.service1Title"),
    t("services.service2Title"),
    t("services.service3Title"),
    t("services.service4Title"),
    t("services.service5Title"),
    t("services.service6Title"),
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await api("/messages", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          service: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-32 lg:py-40 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-onono-midnight-950 via-onono-midnight-900 to-onono-midnight-950">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        {/* Glow effects */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-onono-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-onono-green-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="contact-header text-center mb-20">
          <div className="contact-label text-xs uppercase tracking-[0.35em] text-[#c9a876] mb-4">
            03 — {t("contact.title")}
          </div>

          <h2 className="font-serif text-[clamp(2.25rem,5vw,5rem)] mb-6 leading-[1.1]">
            <span className="block overflow-hidden pb-1">
              <span className="contact-line block text-white font-medium">
                {t("contact.title")}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="contact-line block italic text-[#d8b98a]">
                {t("contact.titleHighlight")}
              </span>
            </span>
          </h2>

          <p className="contact-desc text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="contact-info-col space-y-8">
            <div className="contact-info-item">
              <h3 className="text-2xl font-bold text-white mb-4 font-display">
                {t("contact.infoTitle")}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {t("contact.infoDescription")}
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="contact-info-item group">
                    <div
                      className="glass-card-hover p-5 flex items-start gap-4 cursor-pointer"
                      onClick={() =>
                        info.action && window.open(info.action, "_blank")
                      }
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-onono-cyan-500/20 to-onono-electric-500/20 flex items-center justify-center group-hover:from-onono-cyan-500/30 group-hover:to-onono-electric-500/30 transition-all">
                        <Icon className="w-5 h-5 text-onono-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">
                          {info.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-1">
                          {info.content}
                        </p>
                        <p className="text-gray-500 text-xs">{info.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why Choose Us */}
            <div className="contact-info-item glass-card p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-onono-cyan-500/10 to-onono-green-500/10" />
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-4 font-display">
                  {t("contact.whyUsTitle")}
                </h4>
                <div className="space-y-3">
                  {[
                    t("contact.whyUs1"),
                    t("contact.whyUs2"),
                    t("contact.whyUs3"),
                    t("contact.whyUs4"),
                    t("contact.whyUs5"),
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-onono-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-col">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-onono-cyan-500 to-onono-electric-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  {t("contact.formTitle")}
                </h3>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-onono-cyan-500 to-onono-electric-500 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {t("contact.formSuccessTitle")}
                  </h4>
                  <p className="text-gray-400">
                    {t("contact.formSuccessDescription")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="contact-field">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {t("contact.formName")} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all"
                        placeholder={t("contact.formNamePlaceholder")}
                      />
                    </div>
                    <div className="contact-field">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {t("contact.formEmail")} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all"
                        placeholder={t("contact.formEmailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="contact-field">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {t("contact.formCompany")}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all"
                        placeholder={t("contact.formCompanyPlaceholder")}
                      />
                    </div>
                    <div className="contact-field">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {t("contact.formPhone")}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all"
                        placeholder={t("contact.formPhonePlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="contact-field">
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      {t("contact.formService")}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all"
                    >
                      <option value="" className="bg-onono-midnight-900">
                        {t("contact.formServicePlaceholder")}
                      </option>
                      {services.map((service, index) => (
                        <option
                          key={index}
                          value={service}
                          className="bg-onono-midnight-900"
                        >
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-field">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      {t("contact.formMessage")} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all resize-none"
                      placeholder={t("contact.formMessagePlaceholder")}
                    />
                  </div>

                  {submitError && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-field w-full btn-glow text-onono-midnight-900 font-bold py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-onono-midnight-900 border-t-transparent rounded-full animate-spin" />
                        <span>{t("contact.formSubmitting")}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t("contact.formSubmit")}</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    {t("contact.formAgreement")}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
