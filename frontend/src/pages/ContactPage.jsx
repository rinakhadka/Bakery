import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  HelpCircle,
  Sparkles
} from 'lucide-react';

/**
 * ContactPage Component
 * Bakery contact form, opening hours, location map placeholder, and customer FAQs.
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 4000);
  };

  const faqs = [
    {
      q: 'How far in advance should I order custom birthday or celebration cakes?',
      a: 'For our classic menu cakes, we require 4 hours notice. For custom tiered wedding or multi-flavor sculpted cakes, please order at least 24 to 48 hours in advance.'
    },
    {
      q: 'Do you deliver across the entire Kathmandu Valley?',
      a: 'Yes! We deliver across Kathmandu, Lalitpur, and Bhaktapur. Orders over Rs. 1,000 enjoy 100% free delivery.'
    },
    {
      q: 'Can I pay online with Khalti?',
      a: 'Yes, Khalti is our primary payment partner! You can pay seamlessly via Khalti Digital Wallet, e-banking, or mobile banking.'
    },
    {
      q: 'Do you offer eggless and gluten-conscious options?',
      a: 'Yes, several of our artisan cakes and cookies can be customized eggless. Check the ingredients label on each product details page or mention it in your order notes!'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
          We’d Love to Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5347]">
          Have a question about custom cakes, event catering, or want to drop by for fresh morning croissants? Reach out to our bakers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-7 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#2C1810] border-b border-[#EADBCC] pb-3">
              Bakery Information
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Bakehouse & Café</h4>
                  <p className="text-[#6B5347] leading-relaxed">
                    Bakery Lane, Ward 3, Jhamsikhel / Lalitpur, Kathmandu Valley, Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Telephone Order Line</h4>
                  <p className="text-[#6B5347]">+977 01-555-BAKE (2253)</p>
                  <p className="text-[#6B5347]">+977 984-1234567 (WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Email Inquiries</h4>
                  <p className="text-[#6B5347]">hello@sweetcrumbsbakery.com</p>
                  <p className="text-[#6B5347]">orders@sweetcrumbsbakery.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1810]">Oven & Dispatch Hours</h4>
                  <p className="text-[#6B5347]">Mon - Fri: 7:00 AM – 8:00 PM</p>
                  <p className="text-[#6B5347]">Sat - Sun: 8:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#EADBCC] rounded-3xl p-7 sm:p-9 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#2C1810] border-b border-[#F1E6D8] pb-3">
            Send Us a Message
          </h3>

          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your message has been received. Our bakery team will reply within a few hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#2C1810]">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maya Shrestha"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#2C1810]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. maya@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#2C1810]">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+977 9800000000"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#2C1810]">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B] cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Custom Cake Order">Custom Cake Order</option>
                  <option value="Event Catering">Event Catering</option>
                  <option value="Delivery Question">Delivery Question</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Your Message *</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what delicious treat or celebration you have in mind..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
            Questions & Answers
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-[#EADBCC] space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#2C1810] flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#9F5F2B] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-[#6B5347] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
