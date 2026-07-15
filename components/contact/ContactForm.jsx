"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_TALUKDAR_API_BASE_URL;

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectType: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      errs.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errs.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone is required";
    }
    if (!formData.projectType.trim()) {
      errs.projectType = "Please select a project type";
    }
    if (!formData.message.trim()) {
      errs.message = "Message is required";
    }

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (!BASE_URL) {
        throw new Error(
          "Missing NEXT_PUBLIC_TALUKDAR_API_BASE_URL environment variable.",
        );
      }

      const normalizedBaseUrl = BASE_URL.endsWith("/")
        ? BASE_URL
        : `${BASE_URL}/`;

      const payload = new FormData();
      payload.append("first_name", formData.firstName.trim());
      payload.append("last_name", formData.lastName.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("email", formData.email.trim());
      payload.append("project_type", formData.projectType.trim());
      payload.append("message", formData.message.trim());

      const res = await fetch(`${normalizedBaseUrl}contact-us`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message ?? `Server error: ${res.status}`);
      }

      await res.json();
      toast.success("Message sent successfully! We will contact you soon.");
      setFormData(INITIAL_FORM);
    } catch (err) {
      toast.error(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#f7f5f2] dark:bg-[#162235] rounded p-6 sm:p-8 md:p-10 border border-[#e8dcc9] dark:border-[#26344f]">
      <h2
        className="text-3xl md:text-4xl font-bold text-brand-navy dark:text-[#f0ebe3]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Send Us a Message
      </h2>
      <p className="mt-3 text-gray-600 dark:text-[#9fa8cc]">
        Fill out the form and we will contact you within 24 hours.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-brand-navy dark:text-[#f0ebe3] mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full rounded border ${
                errors.firstName
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-[#d7cab7] dark:border-[#2d3d5b] focus:ring-brand-gold/50"
              } bg-white dark:bg-[#0f1219] px-4 py-3 text-brand-navy dark:text-[#f0ebe3] outline-none focus:ring-2 transition-colors`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-brand-navy dark:text-[#f0ebe3] mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full rounded border ${
                errors.lastName
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-[#d7cab7] dark:border-[#2d3d5b] focus:ring-brand-gold/50"
              } bg-white dark:bg-[#0f1219] px-4 py-3 text-brand-navy dark:text-[#f0ebe3] outline-none focus:ring-2 transition-colors`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-brand-navy dark:text-[#f0ebe3] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded border ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-[#d7cab7] dark:border-[#2d3d5b] focus:ring-brand-gold/50"
              } bg-white dark:bg-[#0f1219] px-4 py-3 text-brand-navy dark:text-[#f0ebe3] outline-none focus:ring-2 transition-colors`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-brand-navy dark:text-[#f0ebe3] mb-2"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full rounded border ${
                errors.phone
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-[#d7cab7] dark:border-[#2d3d5b] focus:ring-brand-gold/50"
              } bg-white dark:bg-[#0f1219] px-4 py-3 text-brand-navy dark:text-[#f0ebe3] outline-none focus:ring-2 transition-colors`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* <div>
          <label htmlFor="projectType" className="block text-sm font-semibold text-brand-navy dark:text-[#f0ebe3] mb-2">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.projectType
                ? 'border-red-400 focus:ring-red-400/50'
                : 'border-[#d7cab7] dark:border-[#2d3d5b] focus:ring-brand-gold/50'
            } bg-white dark:bg-[#0f1219] px-4 py-3 text-brand-navy dark:text-[#f0ebe3] outline-none focus:ring-2 transition-colors`}
          >
            <option value="" disabled>
              Select your project
            </option>
            <option value="bathroom">Bathroom Renovation</option>
            <option value="kitchen">Kitchen Renovation</option>
            <option value="both">Bathroom + Kitchen</option>
            <option value="showroom">Showroom Visit</option>
          </select>
          {errors.projectType && <p className="text-xs text-red-500 mt-1">{errors.projectType}</p>}
        </div> */}

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-brand-navy dark:text-[#f0ebe3] mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.message
                ? "border-red-400 focus:ring-red-400/50"
                : "border-[#d7cab7] dark:border-[#2d3d5b] focus:ring-brand-gold/50"
            } bg-white dark:bg-[#0f1219] px-4 py-3 text-brand-navy dark:text-[#f0ebe3] outline-none focus:ring-2 transition-colors`}
            placeholder="Tell us about your space, style, and budget goals."
          />
          {errors.message && (
            <p className="text-xs text-red-500 mt-1">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded font-semibold text-white bg-brand-gold hover:bg-[#6a5028] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Submit Request"
          )}
        </button>
      </form>
    </div>
  );
}
