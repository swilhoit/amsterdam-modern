import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Amsterdam Modern. Visit our Los Angeles showroom or contact us about our mid-century modern furniture collection.',
};

export default function ContactPage() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground mb-6 gallery-reveal">
          Get In Touch
        </p>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-medium uppercase tracking-wide mb-8 gallery-reveal stagger-1">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground gallery-reveal stagger-2">
          We&apos;d love to hear from you. Whether you have a question about a specific
          piece or want to schedule a showroom visit, we&apos;re here to help.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Contact form */}
        <div className="gallery-reveal stagger-3">
          <h2 className="text-base font-medium uppercase tracking-wide mb-8">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm text-muted-foreground mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-3 bg-transparent border border-border focus:border-warm focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm text-muted-foreground mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-3 bg-transparent border border-border focus:border-warm focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-warm focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm text-muted-foreground mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-warm focus:outline-none transition-colors"
              >
                <option value="general">General Inquiry</option>
                <option value="product">Product Question</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="visit">Schedule a Visit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-muted-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 bg-transparent border border-border focus:border-warm focus:outline-none transition-colors resize-none"
                required
              />
            </div>
            <button type="submit" className="btn-gallery-primary">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="gallery-reveal stagger-4">
          <h2 className="text-base font-medium uppercase tracking-wide mb-8">Visit Our Showroom</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Address
              </h3>
              <p className="text-lg">
                Los Angeles, California
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Contact us for exact location
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Hours
              </h3>
              <div className="space-y-1">
                <p>Monday – Friday: 9am – 5pm</p>
                <p>Saturday: 10am – 6pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Contact
              </h3>
              <div className="space-y-2">
                <p>
                  <a
                    href="mailto:info@amsterdammodern.com"
                    className="hover:text-foreground transition-colors"
                  >
                    info@amsterdammodern.com
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+12132217380"
                    className="hover:text-foreground transition-colors"
                  >
                    213-221-7380
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Follow Us
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/amsterdammodern"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://pinterest.com/amsterdammodern"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest hover:text-foreground transition-colors"
                >
                  Pinterest
                </a>
                <a
                  href="https://facebook.com/amsterdammodernpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest hover:text-foreground transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-12 aspect-[4/3] bg-secondary flex items-center justify-center">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">
              Map
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
