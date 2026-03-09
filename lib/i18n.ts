export type Locale = "en" | "ar"

export const locales: Locale[] = ["en", "ar"]
export const defaultLocale: Locale = "en"

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Projects",
      industries: "Industries",
      faqs: "FAQs",
      careers: "Careers",
      blog: "Blog",
      contact: "Contact",
      getQuote: "Get a Quote",
      callNow: "Call Now",
    },
    hero: {
      headline: "Professional Soft Services for Modern Workplaces",
      subtitle: "Comprehensive facility management solutions that enhance productivity, comfort, and brand image",
      cta1: "Get a Quote",
      cta2: "Explore Services",
    },
    footer: {
      company: "Company",
      services: "Services",
      resources: "Resources",
      contact: "Contact",
      legal: "Legal",
      rights: "All rights reserved",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      aboutUs: "About Us",
      careers: "Careers",
      blog: "Blog",
      housekeeping: "Housekeeping",
      hospitality: "Hospitality",
      security: "Security",
      faqs: "FAQs",
      support: "Support",
    },
    sections: {
      valueHighlights: {
        title: "Why Choose Our Soft Services",
        subtitle: "Comprehensive solutions designed for modern workplaces",
        pillars: [
          {
            title: "Hygiene Excellence",
            description: "Hospital-grade disinfection and cleaning standards",
          },
          {
            title: "Reliability",
            description: "Consistent, professional service you can depend on",
          },
          {
            title: "Sustainability",
            description: "Eco-friendly practices that protect the environment",
          },
          {
            title: "Compliance",
            description: "Full adherence to OSHA and industry regulations",
          },
        ],
      },
      services: {
        title: "Our Services",
        subtitle: "Comprehensive soft services for every need",
        items: [
          {
            title: "Housekeeping & Janitorial",
            description: "Daily cleaning, deep cleaning, and specialized care",
            icon: "Sparkles",
          },
          {
            title: "Hospitality Services",
            description: "Reception, pantry, and guest management",
            icon: "Users",
          },
          {
            title: "Landscaping & Plants",
            description: "Indoor and outdoor greenery maintenance",
            icon: "Leaf",
          },
          {
            title: "Pest Control",
            description: "Safe, eco-friendly pest prevention and treatment",
            icon: "Bug",
          },
          {
            title: "Façade Cleaning",
            description: "Professional exterior cleaning and maintenance",
            icon: "Building2",
          },
          {
            title: "Waste Management",
            description: "Efficient waste collection and disposal",
            icon: "Trash2",
          },
          {
            title: "Manned Security",
            description: "Professional security personnel and monitoring",
            icon: "Shield",
          },
        ],
      },
      whyChooseUs: {
        title: "Why Choose Us",
        items: [
          { title: "Professional Workforce", description: "Trained, vetted, and uniformed staff" },
          { title: "Custom Plans", description: "Tailored solutions for your specific needs" },
          { title: "Hygiene Standards", description: "Hospital-grade cleaning protocols" },
          { title: "Compliance & Safety", description: "Full regulatory compliance and insurance" },
          { title: "Single Point of Contact", description: "Integrated service management" },
          { title: "Sustainability", description: "Eco-friendly and responsible practices" },
        ],
      },
      caseStudies: {
        title: "Case Studies & Results",
        subtitle: "Real results from our clients",
        items: [
          {
            title: "Corporate Office Transformation",
            description: "Reduced cleaning complaints by 95% and improved employee satisfaction",
            metrics: "95% reduction in complaints",
          },
          {
            title: "Hospitality Excellence",
            description: "Faster response times and improved guest experience ratings",
            metrics: "40% faster response time",
          },
          {
            title: "Facility Optimization",
            description: "Streamlined operations and cost savings through integrated services",
            metrics: "30% cost reduction",
          },
        ],
      },
      testimonials: {
        title: "What Our Clients Say",
        items: [
          {
            quote: "Exceptional service and professionalism. Our office has never looked better.",
            author: "Sarah Johnson",
            company: "Tech Innovations Inc.",
            rating: 5,
          },
          {
            quote: "Reliable, efficient, and truly care about our workspace. Highly recommended.",
            author: "Michael Chen",
            company: "Global Consulting Group",
            rating: 5,
          },
          {
            quote: "Outstanding attention to detail and consistent quality. A true partner.",
            author: "Emma Rodriguez",
            company: "Premium Hospitality Co.",
            rating: 5,
          },
        ],
      },
      kpis: {
        title: "Our Impact",
        items: [
          { label: "Sites Served", value: "500+" },
          { label: "Monthly Inspections", value: "10,000+" },
          { label: "Avg Response Time", value: "2 hours" },
          { label: "Client Satisfaction", value: "98%" },
        ],
      },
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "عن الشركة",
      services: "الخدمات",
      projects: "المشاريع",
      industries: "الصناعات",
      faqs: "الأسئلة الشائعة",
      careers: "الوظائف",
      blog: "المدونة",
      contact: "اتصل بنا",
      getQuote: "احصل على عرض سعر",
      callNow: "اتصل الآن",
    },
    hero: {
      headline: "خدمات احترافية للمكاتب الحديثة",
      subtitle: "حلول شاملة لإدارة المرافق تعزز الإنتاجية والراحة وصورة العلامة التجارية",
      cta1: "احصل على عرض سعر",
      cta2: "استكشف الخدمات",
    },
    footer: {
      company: "الشركة",
      services: "الخدمات",
      resources: "الموارد",
      contact: "اتصل بنا",
      legal: "القانونية",
      rights: "جميع الحقوق محفوظة",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      aboutUs: "عن الشركة",
      careers: "الوظائف",
      blog: "المدونة",
      housekeeping: "الخدمات النظافة",
      hospitality: "خدمات الضيافة",
      security: "الأمن",
      faqs: "الأسئلة الشائعة",
      support: "الدعم",
    },
    sections: {
      valueHighlights: {
        title: "لماذا تختار خدماتنا المرنة",
        subtitle: "حلول شاملة مصممة للمكاتب الحديثة",
        pillars: [
          {
            title: "تميز النظافة",
            description: "معايير التطهير والتنظيف بمستوى المستشفيات",
          },
          {
            title: "الموثوقية",
            description: "خدمة احترافية متسقة يمكنك الاعتماد عليها",
          },
          {
            title: "الاستدامة",
            description: "ممارسات صديقة للبيئة تحمي البيئة",
          },
          {
            title: "الامتثال",
            description: "الامتثال الكامل لمعايير OSHA والصناعة",
          },
        ],
      },
      services: {
        title: "خدماتنا",
        subtitle: "خدمات مرنة شاملة لكل احتياج",
        items: [
          {
            title: "التنظيف والخدمات الداخلية",
            description: "التنظيف اليومي والعميق والعناية المتخصصة",
            icon: "Sparkles",
          },
          {
            title: "خدمات الضيافة",
            description: "الاستقبال وإدارة المطبخ والضيوف",
            icon: "Users",
          },
          {
            title: "تنسيق الحدائق والنباتات",
            description: "صيانة النباتات الداخلية والخارجية",
            icon: "Leaf",
          },
          {
            title: "مكافحة الحشرات",
            description: "الوقاية والعلاج الآمن والصديق للبيئة",
            icon: "Bug",
          },
          {
            title: "تنظيف الواجهات",
            description: "التنظيف والصيانة الخارجية الاحترافية",
            icon: "Building2",
          },
          {
            title: "إدارة النفايات",
            description: "جمع ومعالجة النفايات بكفاءة",
            icon: "Trash2",
          },
          {
            title: "الأمن البشري",
            description: "موظفو أمن محترفون ومراقبة",
            icon: "Shield",
          },
        ],
      },
      whyChooseUs: {
        title: "لماذا تختارنا",
        items: [
          { title: "فريق احترافي", description: "موظفون مدربون ومفحوصون وموحدون" },
          { title: "خطط مخصصة", description: "حلول مصممة لاحتياجاتك المحددة" },
          { title: "معايير النظافة", description: "بروتوكولات التنظيف بمستوى المستشفيات" },
          { title: "الامتثال والسلامة", description: "الامتثال الكامل للوائح والتأمين" },
          { title: "نقطة اتصال واحدة", description: "إدارة الخدمات المتكاملة" },
          { title: "الاستدامة", description: "ممارسات صديقة للبيئة ومسؤولة" },
        ],
      },
      caseStudies: {
        title: "دراسات الحالة والنتائج",
        subtitle: "نتائج حقيقية من عملائنا",
        items: [
          {
            title: "تحويل مكتب الشركة",
            description: "تقليل شكاوى التنظيف بنسبة 95% وتحسين رضا الموظفين",
            metrics: "تقليل 95% من الشكاوى",
          },
          {
            title: "تميز الضيافة",
            description: "أوقات استجابة أسرع وتحسين تقييمات تجربة الضيوف",
            metrics: "وقت استجابة أسرع بنسبة 40%",
          },
          {
            title: "تحسين المرافق",
            description: "تبسيط العمليات وتوفير التكاليف من خلال الخدمات المتكاملة",
            metrics: "تقليل التكاليف بنسبة 30%",
          },
        ],
      },
      testimonials: {
        title: "ما يقوله عملاؤنا",
        items: [
          {
            quote: "خدمة استثنائية واحترافية. لم يبدو مكتبنا أفضل من أي وقت مضى.",
            author: "سارة جونسون",
            company: "شركة الابتكارات التقنية",
            rating: 5,
          },
          {
            quote: "موثوقة وفعالة وتهتم حقاً بمساحة عملنا. موصى به بشدة.",
            author: "مايكل تشن",
            company: "مجموعة الاستشارات العالمية",
            rating: 5,
          },
          {
            quote: "اهتمام استثنائي بالتفاصيل وجودة متسقة. شريك حقيقي.",
            author: "إيما رودريغيز",
            company: "شركة الضيافة الممتازة",
            rating: 5,
          },
        ],
      },
      kpis: {
        title: "تأثيرنا",
        items: [
          { label: "المواقع المخدومة", value: "500+" },
          { label: "الفحوصات الشهرية", value: "10,000+" },
          { label: "متوسط وقت الاستجابة", value: "2 ساعات" },
          { label: "رضا العملاء", value: "98%" },
        ],
      },
    },
  },
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
