"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Cache busting utility - adds timestamp to image URLs to force fresh loads
function addCacheBuster(url: string | undefined): string | undefined {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  
  // If URL already has query params, append with &, otherwise use ?
  const separator = url.includes('?') ? '&' : '?'
  const timestamp = new Date().getTime()
  return `${url}${separator}v=${timestamp}`
}

// Recursively add cache busters to all image URLs in an object
function bustImageCaches(obj: any): any {
  if (!obj) return obj
  
  if (typeof obj === 'string') {
    // Check if this might be an image URL
    if (obj.includes('blob.vercel') || obj.includes('http') || obj.startsWith('/images')) {
      return addCacheBuster(obj)
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => bustImageCaches(item))
  }
  
  if (typeof obj === 'object') {
    const result: any = {}
    for (const key of Object.keys(obj)) {
      // Keys that typically contain image URLs
      if (key.includes('image') || key.includes('Url') || key.includes('url') || key.includes('logo')) {
        result[key] = bustImageCaches(obj[key])
      } else {
        result[key] = bustImageCaches(obj[key])
      }
    }
    return result
  }
  
  return obj
}

// Define content structure for ALL editable sections across the site
export interface SiteContent {
  // HOME PAGE SECTIONS
  hero: {
    videoUrl: string
    en: {
      tagline: string
      headline: string
      highlightedText: string
      subtitle: string
      ctaPrimary: string
      ctaSecondary: string
    }
    ar: {
      tagline: string
      headline: string
      highlightedText: string
      subtitle: string
      ctaPrimary: string
      ctaSecondary: string
    }
  }
  kpis: {
    items: Array<{
      id: string
      value: string
      en: { label: string }
      ar: { label: string }
    }>
  }
  testimonials: {
    items: Array<{
      id: string
      rating: number
      en: { quote: string; author: string; company: string }
      ar: { quote: string; author: string; company: string }
    }>
  }
  caseStudies: {
    items: Array<{
      id: string
      imageUrl: string
      en: { title: string; description: string; metrics: string; challenges?: string; solution?: string; results?: string }
      ar: { title: string; description: string; metrics: string; challenges?: string; solution?: string; results?: string }
    }>
  }
  whyChooseUs: {
    imageUrl: string
    items: Array<{
      id: string
      en: { title: string; description: string }
      ar: { title: string; description: string }
    }>
  }
  valueHighlights: {
    pillars: Array<{
      id: string
      imageUrl: string
      en: { title: string; description: string }
      ar: { title: string; description: string }
    }>
  }
  services: {
    items: Array<{
      id: string
      slug: string
      imageUrl: string
      en: { title: string; description: string; detailedContent?: string }
      ar: { title: string; description: string; detailedContent?: string }
      seo?: {
        en?: {
          metaTitle?: string
          metaDescription?: string
          keywords?: string
          ogTitle?: string
          ogDescription?: string
        }
        ar?: {
          metaTitle?: string
          metaDescription?: string
          keywords?: string
          ogTitle?: string
          ogDescription?: string
        }
      }
    }>
  }

  // HOMEPAGE SECTION MANAGEMENT
  homepageSections: {
    valueHighlights: { visible: boolean; en: { title: string }; ar: { title: string } }
    servicesVideo: { visible: boolean; en: { title: string }; ar: { title: string } }
    kpis: { visible: boolean; en: { title: string }; ar: { title: string } }
    services: { visible: boolean; en: { title: string }; ar: { title: string } }
    projects: { visible: boolean; en: { title: string }; ar: { title: string } }
    whyChooseUs: { visible: boolean; en: { title: string }; ar: { title: string } }
    testimonials: { visible: boolean; en: { title: string }; ar: { title: string } }
    news: { visible: boolean; en: { title: string }; ar: { title: string } }
  }

  // ABOUT PAGE
  about: {
    heroImageUrl: string
    visionImageUrl: string
    missionImageUrl: string
    en: {
      title: string
      subtitle: string
      visionTitle: string
      visionDescription: string
      visionPoints: string[]
      missionTitle: string
      missionDescription: string
      missionPoints: string[]
      valuesTitle: string
      valuesSubtitle: string
    }
    ar: {
      title: string
      subtitle: string
      visionTitle: string
      visionDescription: string
      visionPoints: string[]
      missionTitle: string
      missionDescription: string
      missionPoints: string[]
      valuesTitle: string
      valuesSubtitle: string
    }
    coreValues: Array<{
      id: string
      icon: string
      en: { title: string; description: string }
      ar: { title: string; description: string }
    }>
  }

  // BLOG PAGE
  blog: {
    posts: Array<{
      id: string
      imageUrl: string
      date: string
      en: { title: string; excerpt: string; fullContent: string; author: string; category: string }
      ar: { title: string; excerpt: string; fullContent: string; author: string; category: string }
    }>
  }

  // NEWS PAGE
  news: {
    items: Array<{
      id: string
      imageUrl: string
      date: string
      en: { title: string; excerpt: string; fullContent: string; author: string; category: string }
      ar: { title: string; excerpt: string; fullContent: string; author: string; category: string }
    }>
  }

  // CAREERS PAGE
  careers: {
    positions: Array<{
      id: string
      en: { title: string; department: string; location: string; description: string }
      ar: { title: string; department: string; location: string; description: string }
    }>
  }

  // FAQs PAGE
  faqs: {
    items: Array<{
      id: string
      en: { question: string; answer: string }
      ar: { question: string; answer: string }
    }>
  }

  // CONTACT INFO
  contact: {
    email: string
    phone: string
    whatsapp: string
    address: {
      en: string
      ar: string
    }
    locations: Array<{
      id: string
      phone: string
      email: string
      en: { city: string; address: string }
      ar: { city: string; address: string }
    }>
  }

  // FOOTER
  footer: {
    stats: Array<{
      id: string
      value: string
      en: { label: string }
      ar: { label: string }
    }>
  }

  // SEO SETTINGS
  seo: {
    general: {
      defaultMetaTitle: string
      defaultMetaDescription: string
      metaKeywords: string
      faviconUrl: string
    }
    pages: Array<{
      id: string
      slug: string
      metaTitle: string
      metaDescription: string
      metaKeywords: string
      canonicalUrl: string
      ogImage: string
      twitterCard: string
    }>
    integrations: {
      googleSearchConsoleId: string
      googleAnalyticsId: string
      googleTagManagerId: string
    }
  }

  // WHATSAPP CONTROL
  whatsapp: {
    enabled: boolean
    phoneNumber: string
    prefilledMessage: string
    position: "left" | "right"
    customIconUrl: string
  }

  // SOCIAL MEDIA CONTROL
  socialMedia: {
    items: Array<{
      id: string
      platform: "facebook" | "messenger" | "instagram" | "linkedin" | "twitter" | "youtube" | "tiktok" | "snapchat"
      enabled: boolean
      url: string
      customIconUrl: string
      position: "header" | "footer" | "floating"
      openInNewTab: boolean
    }>
  }

  // NAVBAR CONTROL
  navbar: {
    logo: {
      url: string
      alt: string
      height: number
    }
    colors: {
      background: string
      text: string
      hover: string
      accent: string
    }
    navigation: {
      en: Array<{ label: string; href: string }>
      ar: Array<{ label: string; href: string }>
    }
    cta: {
      en: string
      ar: string
    }
  }

  // ANIMATION SETTINGS
  animations: {
    aboutPageAnimationDelay: number
  }
}

// Default content pulled from the existing site
const defaultContent: SiteContent = {
  hero: {
    videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Video_Generation_Based_on_Concept-BXqzVhY44Hicwtxk40zzShyS4UvRHY.mp4",
    en: {
      tagline: "OUR PREMIUM SERVICES",
      headline: "We Provide ",
      highlightedText: "Integrated Solutions",
      subtitle: "Comprehensive services to enhance your workplace environment and employee comfort",
      ctaPrimary: "Explore Services",
      ctaSecondary: "Get a Quote",
    },
    ar: {
      tagline: "خدماتنا المتميزة",
      headline: "نحن نقدم ",
      highlightedText: "حلولاً متكاملة",
      subtitle: "خدمات شاملة لتحسين بيئة عملك وراحة موظفيك",
      ctaPrimary: "استكشف الخدمات",
      ctaSecondary: "احصل على عرض سعر",
    },
  },
  kpis: {
    items: [
      { id: "1", value: "500+", en: { label: "Sites Served" }, ar: { label: "المواقع المخدومة" } },
      { id: "2", value: "10,000+", en: { label: "Monthly Inspections" }, ar: { label: "الفحوصات الشهرية" } },
      { id: "3", value: "2 hours", en: { label: "Avg Response Time" }, ar: { label: "متوسط وقت الاستجابة" } },
      { id: "4", value: "98%", en: { label: "Client Satisfaction" }, ar: { label: "رضا العملاء" } },
    ],
  },
  testimonials: {
    items: [
      {
        id: "1",
        rating: 5,
        en: {
          quote: "Exceptional service and professionalism. Our office has never looked better.",
          author: "Sarah Johnson",
          company: "Tech Innovations Inc.",
        },
        ar: {
          quote: "خدمة استثنائية واحترافية. لم يبدو مكتبنا أفضل من أي وقت مضى.",
          author: "س����رة جونسون",
          company: "شركة الابتكارات التقنية",
        },
      },
      {
        id: "2",
        rating: 5,
        en: {
          quote: "Reliable, efficient, and truly care about our workspace. Highly recommended.",
          author: "Michael Chen",
          company: "Global Consulting Group",
        },
        ar: {
          quote: "موثوقة وفعالة وتهتم حقاً بمساحة عملنا. موصى به بشدة.",
          author: "مايكل تشن",
          company: "مجموعة الاستشارات العالمية",
        },
      },
      {
        id: "3",
        rating: 5,
        en: {
          quote: "Outstanding attention to detail and consistent quality. A true partner.",
          author: "Emma Rodriguez",
          company: "Premium Hospitality Co.",
        },
        ar: {
          quote: "اهتمام استثنائي بالتفاصيل وجودة متسقة. شريك حقيقي.",
          author: "إيما رودريغيز",
          company: "شركة الضيافة الممتازة",
        },
      },
    ],
  },
  caseStudies: {
    items: [
      {
        id: "1",
        imageUrl: "/images/case-study-corporate-transformation.jpg",
        en: {
          title: "Corporate Office Transformation",
          description: "Reduced cleaning complaints by 95% and improved employee satisfaction",
          metrics: "95% reduction in complaints",
          challenges: "The client's corporate office was experiencing high employee complaints about cleanliness standards, which was affecting workplace morale and productivity. The facility had inadequate cleaning schedules and lacked modern cleaning protocols.",
          solution: "We implemented a comprehensive cleaning program with daily deep cleaning, enhanced sanitization protocols, and modern cleaning equipment. We established clear cleaning schedules, trained staff on best practices, and introduced a quality assurance system with regular inspections.",
          results: "Within three months, cleaning complaints dropped by 95%. Employee satisfaction scores improved by 40%, productivity increased by 25%, and the facility now maintains the highest cleanliness standards.",
        },
        ar: {
          title: "تحويل مكتب الشركة",
          description: "تقليل شكاوى التنظيف بنسبة 95% وتحسين رضا الموظفين",
          metrics: "تقليل 95% من الشكاوى",
          challenges: "كان مكتب العميل الشركة يعاني من شكاوى الموظفين الكثيرة حول معايير النظافة، مما كان يؤثر على معنويات مكان العمل والإنتاجية. لم تكن المنشأة تتمتع بجداول تنظيف كافية وافتقرت إلى بروتوكولات تنظيف حديثة.",
          solution: "قمنا بتنفيذ برنامج تنظيف شامل مع تنظيف عميق يومي وبروتوكولات تطهير محسّنة ومعدات تنظيف حديثة. وضعنا جداول تنظيف واضحة وقمنا بتدريب الموظفين على أفضل الممارسات وقدمنا نظام ضمان الجودة مع عمليات تفتيش منتظمة.",
          results: "خلال ثلاثة أشهر، انخفضت شكاوى التنظيف بنسبة 95%. تحسنت درجات رضا الموظفين بنسبة 40%، وزادت الإنتاجية بنسبة 25%، والآن تحافظ المنشأة على أعلى معايير النظافة.",
        },
      },
      {
        id: "2",
        imageUrl: "/images/case-study-hospitality-excellence.jpg",
        en: {
          title: "Hospitality Excellence",
          description: "Faster response times and improved guest experience ratings",
          metrics: "40% faster response time",
          challenges: "A leading hospitality chain was facing guest complaints about slow maintenance response times and inconsistent service quality across multiple properties.",
          solution: "We implemented an integrated facilities management system covering cleaning, maintenance, and security across all locations. We trained staff in hospitality excellence protocols and established real-time response systems for guest requests.",
          results: "Response times improved by 40%, guest satisfaction scores increased by 50%, repeat booking rates rose by 35%, and operational efficiency improved significantly across all properties.",
        },
        ar: {
          title: "تميز الضيافة",
          description: "أوقات استجابة أسرع وتحسين تقييمات تجربة الضيوف",
          metrics: "وقت استجابة أسرع بنسبة 40%",
          challenges: "كانت سلسلة فنادق رائدة تواجه شكاوى الضيوف حول أوقات الاستجابة البطيئة للصيانة وعدم الاتساق في جودة الخدمة عبر مراكز متعددة.",
          solution: "قمنا بتنفيذ نظام متكامل لإدارة المرافق يغطي التنظيف والصيانة والأمن عبر جميع المواقع. قمنا بتدريب الموظفين على بروتوكولات تميز الضيافة وأنشأنا أنظمة استجابة في الوقت الفعلي لطلبات الضيوف.",
          results: "تحسنت أوقات الاستجابة بنسبة 40%، ارتفعت درجات رضا الضيوف بنسبة 50%، ارتفعت معدلات الحجز المتكرر بنسبة 35%، وتحسنت الكفاءة التشغيلية بشكل كبير عبر جميع المراكز.",
        },
      },
      {
        id: "3",
        imageUrl: "/images/case-study-facility-optimization.jpg",
        en: {
          title: "Facility Optimization",
          description: "Streamlined operations and cost savings through integrated services",
          metrics: "30% cost reduction",
          challenges: "A large multinational organization was managing multiple facility services through different vendors, leading to inconsistent quality, poor coordination, and rising operational costs.",
          solution: "We consolidated all facility services (cleaning, security, maintenance) under one integrated management system. We optimized work schedules, implemented modern cleaning technologies, and established unified quality standards.",
          results: "Operational costs reduced by 30%, service quality improved by 45%, management efficiency increased, and the client achieved better control over facility operations with a single trusted partner.",
        },
        ar: {
          title: "تحسين المرافق",
          description: "تبسيط العمليات وتوفير التكاليف من خلال الخدمات المتكاملة",
          metrics: "تقليل التكاليف بنسبة 30%",
          challenges: "كانت منظمة عملاقة متعددة الجنسيات تدير عدة خدمات مرافق من خلال موردين مختلفين، مما أدى إلى جودة غير متسقة وتنسيق سيئ وارتفاع التكاليف التشغيلية.",
          solution: "قمنا بدمج جميع خدمات المرافق (التنظيف والأمن والصيانة) تحت نظام إدارة متكامل واحد. قمنا بتحسين جداول العمل وتنفيذ تقنيات تنظيف حديثة وإنشاء معايير جودة موحدة.",
          results: "انخفضت التكاليف التشغيلية بنسبة 30%، تحسنت جودة الخدمة بنسبة 45%، زادت كفاءة الإدارة، وحققت العميل السيطرة بشكل أفضل على عمليات المرافق مع شريك واحد موثوق.",
        },
      },
    ],
  },
  whyChooseUs: {
    imageUrl: "/images/hospitality-excellence-why-us.jpg",
    items: [
      {
        id: "1",
        en: { title: "Experienced Team", description: "Over 15 years of industry expertise with certified professionals" },
        ar: { title: "فريق ذو خبرة", description: "أكثر من 15 عامًا من الخبرة في الصناعة مع محترفين معتمدين" },
      },
      {
        id: "2",
        en: { title: "24/7 Support", description: "Round-the-clock customer service and emergency response" },
        ar: { title: "دعم على مدار الساعة", description: "خدمة عملاء على مدار الساعة واستجابة للطوارئ" },
      },
      {
        id: "3",
        en: { title: "Quality Guaranteed", description: "Strict quality control measures and satisfaction guarantee" },
        ar: { title: "جودة مضمونة", description: "تدابير صارمة لمراقبة الجودة وضمان الرضا" },
      },
      {
        id: "4",
        en: { title: "Eco-Friendly", description: "Sustainable practices and environmentally safe products" },
        ar: { title: "صديق للبيئة", description: "ممارسات مستدامة ومنتجات آمنة بيئياً" },
      },
    ],
  },
  valueHighlights: {
    pillars: [
      {
        id: "1",
        imageUrl: "/images/hygiene-excellence.png",
        en: { title: "Hygiene Excellence", description: "Maintaining highest cleanliness standards" },
        ar: { title: "التميز في النظافة", description: "الحفاظ على أعلى معايير النظافة" },
      },
      {
        id: "2",
        imageUrl: "/images/reliability.png",
        en: { title: "Reliability", description: "Consistent and dependable service delivery" },
        ar: { title: "الموثوقية", description: "تقديم خدمة متسقة وموثوقة" },
      },
      {
        id: "3",
        imageUrl: "/images/sustainability.png",
        en: { title: "Sustainability", description: "Eco-friendly practices and green solutions" },
        ar: { title: "الاستدامة", description: "ممارسات صديقة للبيئة وحلول خضراء" },
      },
      {
        id: "4",
        imageUrl: "/images/compliance.png",
        en: { title: "Compliance", description: "Full regulatory and safety compliance" },
        ar: { title: "الامتثال", description: "الامتثال الكامل للوائح والسلامة" },
      },
    ],
  },
  services: {
    items: [
      {
        id: "1",
        slug: "housekeeping-janitorial",
        imageUrl: "/images/housekeeping-janitorial.png",
        en: { title: "Housekeeping & Janitorial", description: "Professional cleaning services for your premises" },
        ar: { title: "التدبير المنزلي والنظافة", description: "خدمات ��نظيف احترافية لمبانيك" },
      },
      {
        id: "2",
        slug: "hospitality-services",
        imageUrl: "/images/hospitality-services.png",
        en: { title: "Hospitality Services", description: "Premium hospitality and guest services" },
        ar: { title: "خدمات الضيافة", description: "خدمات ضيافة وضيوف متميزة" },
      },
      {
        id: "3",
        slug: "landscaping-plants",
        imageUrl: "/images/landscaping-plants.png",
        en: { title: "Landscaping & Plants", description: "Beautiful outdoor spaces and greenery" },
        ar: { title: "تنسيق الحدائق والنباتات", description: "مساحات خارجية جميلة ومساحات خضراء" },
      },
      {
        id: "4",
        slug: "pest-control",
        imageUrl: "/images/pest-control-outdoor.png",
        en: { title: "Pest Control", description: "Effective pest management solutions" },
        ar: { title: "مكافحة الآفات", description: "حلول فعالة لإدارة الآفات" },
      },
      {
        id: "5",
        slug: "facade-cleaning",
        imageUrl: "/images/facade-cleaning.png",
        en: { title: "Facade Cleaning", description: "Professional exterior cleaning services" },
        ar: { title: "تنظيف الواجهات", description: "خدمات تنظيف خارجية احترافية" },
      },
      {
        id: "6",
        slug: "waste-management",
        imageUrl: "/images/waste-management.png",
        en: { title: "Waste Management", description: "Efficient waste disposal and recycling" },
        ar: { title: "إدارة النفايات", description: "التخلص الفعال من النفايات وإعادة التدوير" },
      },
      {
        id: "7",
        slug: "manned-security",
        imageUrl: "/images/manned-security.png",
        en: { title: "Manned Security", description: "Professional security personnel services" },
        ar: { title: "الأمن المأهول", description: "خدمات أفراد الأمن المحترفين" },
      },
    ],
  },
  about: {
    heroImageUrl: "/images/vision-innovation.png",
    visionImageUrl: "/images/vision-innovation.png",
    missionImageUrl: "/images/mission-excellence.png",
    en: {
      title: "About Amaal Sahari",
      subtitle: "Comprehensive facility management services providing integrated workplace solutions that enhance productivity and comfort",
      visionTitle: "Our Vision",
      visionDescription: "To be the leading provider of integrated facility management solutions that transform workplaces into thriving ecosystems where employees flourish and businesses excel.",
      visionPoints: [
        "Create sustainable, healthy work environments",
        "Drive innovation in facility management",
        "Build lasting partnerships with our clients",
        "Empower our team to deliver excellence",
      ],
      missionTitle: "Our Mission",
      missionDescription: "To deliver comprehensive, innovative facility management services that enhance productivity, comfort, and brand value while maintaining the highest standards of sustainability and employee wellbeing.",
      missionPoints: [
        "Deliver exceptional customer service",
        "Maintain highest safety and quality standards",
        "Promote environmental sustainability",
        "Foster a culture of continuous improvement",
      ],
      valuesTitle: "Our Core Values",
      valuesSubtitle: "The principles that guide every decision and action we take",
    },
    ar: {
      title: "عن أمال الصحاري",
      subtitle: "خدمات شاملة لإدارة المرافق توفر بيئات عمل متكاملة تعزز الإنتاجية والراحة",
      visionTitle: "رؤيتنا",
      visionDescription: "أن نكون المزود الرائد لحل��ل إدارة المرافق المتكاملة التي تحول أماكن العمل إلى نظم بيئية مزدهرة حيث يزدهر الموظفون وتتفوق الشركات.",
      visionPoints: [
        "إنشاء بيئات عمل مستدامة وصحية",
        "تحفيز الابتكار في إدارة المرافق",
        "بناء شراكات دائمة ��ع عملائنا",
        "تمكين فريقنا لتحقيق التميز",
      ],
      missionTitle: "مهمتنا",
      missionDescription: "تقديم خدمات إدارة مرافق شاملة ومبتكرة تعزز الإنتاجية والراحة والقيمة التجارية مع الحفاظ على أعلى معايير الاستدامة وصحة الموظفين.",
      missionPoints: [
        "تقديم خدمة عملاء استثنائية",
        "الحفاظ على أعلى معايير السلامة والجودة",
        "تعزيز الاستدامة البيئية",
        "غرس ثقافة التحسين المستمر",
      ],
      valuesTitle: "قيمنا الأساسية",
      valuesSubtitle: "المبادئ التي توجه كل قرار وإجراء نتخذه",
    },
    coreValues: [
      {
        id: "1",
        icon: "Heart",
        en: { title: "Care", description: "We genuinely care about our clients, employees, and the environment" },
        ar: { title: "الرعاية", description: "نهتم براعاية عملائنا وموظفينا والبيئة" },
      },
      {
        id: "2",
        icon: "Zap",
        en: { title: "Excellence", description: "We strive for excellence in everything we do" },
        ar: { title: "التميز", description: "نسعى للتميز في كل ما نقوم به" },
      },
      {
        id: "3",
        icon: "Users",
        en: { title: "Teamwork", description: "We believe in the power of collaboration and teamwork" },
        ar: { title: "العمل الجماعي", description: "نؤمن بقوة التعاون والعمل الجماعي" },
      },
      {
        id: "4",
        icon: "Globe",
        en: { title: "Sustainability", description: "We are committed to sustainable and eco-friendly practices" },
        ar: { title: "الاستدامة", description: "نلتزم بالممارسات المستدامة والصديقة للبيئة" },
      },
    ],
  },
  blog: {
    posts: [
      {
        id: "1",
        imageUrl: "/images/office-cleaning.png",
        date: "2025-01-15",
        en: { title: "The Importance of Cleanliness in the Workplace", excerpt: "Learn how to improve your workplace environment by maintaining high cleanliness standards.", fullContent: "A clean workplace is essential for employee well-being, productivity, and safety. Regular cleaning reduces the spread of germs and illnesses, improves air quality, and creates a professional appearance for clients and visitors.\n\nProper cleaning routines should include:\n- Daily surface disinfection\n- Regular carpet and floor maintenance\n- Windows and glass cleaning\n- Break room sanitation\n- Bathroom deep cleaning\n\nInvesting in professional cleaning services ensures your workplace maintains the highest standards of cleanliness and hygiene.", author: "Ahmed Mohamed", category: "Cleanliness" },
        ar: { title: "أهمية النظافة في مكان العمل", excerpt: "تعرف على كيفية تحسين بيئة العمل من خلال الحفاظ على معايير النظافة العالية.", fullContent: "المساحة النظيفة ضرورية لرفاهية الموظفين والإنتاجية والسلامة. التنظيف المنتظم يقلل انتشار الجراثيم والأمراض ويحسن جودة الهواء ويخلق مظهراً احترافياً للعملاء والزوار.\n\nيجب أن تشمل روتينات التنظيف الصحيحة:\n- تطهير السطح اليومي\n- صيانة السجاد والأرضيات المنتظمة\n- تنظيف النوافذ والزجاج\n- تعقيم غرفة الاستراحة\n- التنظيف العميق للحمامات\n\nالاستثمار في خدمات التنظيف الاحترافية يضمن أن مكان عملك يحافظ على أعلى معايير النظافة والصحة.", author: "أحمد محمد", category: "النظافة" },
      },
      {
        id: "2",
        imageUrl: "/images/recycling-waste-management.png",
        date: "2025-01-10",
        en: { title: "Sustainable Waste Management Strategies", excerpt: "Explore best practices for managing waste in an eco-friendly and cost-effective manner.", fullContent: "Effective waste management is crucial for environmental sustainability and operational efficiency. Organizations that implement proper waste management systems can reduce costs, improve their environmental footprint, and enhance their corporate image.\n\nKey waste management strategies include:\n- Waste segregation and recycling programs\n- Composting organic materials\n- Reducing single-use plastics\n- Partnering with certified waste disposal companies\n- Employee training on waste reduction\n- Monitoring and reporting waste metrics\n\nBy adopting sustainable waste practices, your organization can contribute to environmental conservation while improving operational efficiency.", author: "Fatima Ali", category: "Environment" },
        ar: { title: "استراتيجيات إدارة النفايات المستدامة", excerpt: "استكشف أفضل الممارسات لإدارة النفايات بطريقة صديقة للبيئة وفعالة.", fullContent: "إدارة النفايات الفعالة ضرورية للاستدامة البيئية والكفاءة التشغيلية. يمكن للمنظمات التي تنفذ أنظمة إدارة النفايات الصحيحة تقليل التكاليف وتحسين بصمتها البيئية وتعزيز صورتها المؤسسية.\n\nتشمل استراتيجيات إدارة النفايات الرئيسية:\n- فصل النفايات وبرامج إعادة التدوير\n- تسميد المواد العضوية\n- تقليل البلاستيك يحد الاستخدام\n- الشراكة مع شركات التخلص من النفايات المعتمدة\n- تدريب الموظفين على تقليل النفايات\n- مراقبة وإبلاغ مقاييس النفايات\n\nبتبني ممارسات النفايات المستدامة، يمكن لمنظمتك المساهمة في حماية البيئة مع تح����ين الكفاءة التشغيلية.", author: "فاطمة علي", category: "البيئة" },
      },
      {
        id: "3",
        imageUrl: "/images/security-professional.png",
        date: "2025-01-05",
        en: { title: "Security and Safety in Commercial Facilities", excerpt: "Important tips for enhancing security and safety in your commercial facilities.", fullContent: "Security and safety are paramount concerns for any commercial facility. A comprehensive security strategy protects your assets, employees, and visitors while providing peace of mind.\n\nEssential security measures include:\n- Regular facility inspections and risk assessments\n- CCTV surveillance systems\n- Access control and visitor management\n- Emergency response procedures\n- Staff training on safety protocols\n- Regular security audits\n- Lighting and perimeter security\n- Clear emergency evacuation plans\n\nImplementing these measures creates a secure environment that allows your business to operate efficiently and your team to feel safe at work.", author: "Mahmoud Ahmed", category: "Security" },
        ar: { title: "الأمن والسلامة في المرافق التجارية", excerpt: "نصائح مهمة لتحسين الأمن والسلامة في مرافقك التجارية.", fullContent: "الأمن والسلامة من الاهتمامات القصوى لأي منشأة تجارية. تحمي استراتيجية الأمن الشاملة أصولك وموظفيك والزوار مع توفير راحة البال.\n\nتشمل التدابير الأمنية الأساسية:\n- عمليات التفتيش الدورية وتقييمات المخاطر\n- أنظمة المراقبة بالكاميرا\n- التحكم في الوصول وإدارة الزوار\n- إجراءات الاستجابة للطوارئ\n- تدريب الموظفين على بروتوكولات السلامة\n- عمليات تدقيق الأمن المنتظمة\n- الإضاءة وأمن المحيط\n- خطط إخلاء الطوارئ الواضحة\n\nيخلق تنفيذ هذه التدابير بيئة آمنة تسمح لعملك بالعمل بكفاءة وتشعر فريقك بالأمان في العمل.", author: "محمود أحمد", category: "الأمن" },
      },
      {
        id: "4",
        imageUrl: "/images/business-meeting.png",
        date: "2024-12-28",
        en: { title: "High-Quality Hospitality Services", excerpt: "How to provide exceptional hospitality services to your guests and employees.", fullContent: "Exceptional hospitality services set your business apart from competitors and create lasting impressions with guests and employees. Quality hospitality encompasses cleanliness, professionalism, and attention to detail.\n\nKey elements of high-quality hospitality include:\n- Professional and courteous staff\n- Immaculate facility cleanliness\n- Comfortable and well-maintained spaces\n- Responsive customer service\n- Attention to guest preferences\n- Quality refreshments and amenities\n- Regular staff training and development\n- Consistent service standards\n\nInvesting in hospitality excellence demonstrates your commitment to quality and creates positive experiences that encourage repeat business and referrals.", author: "Layla Mahmoud", category: "Hospitality" },
        ar: { title: "الخدمات الفندقية ذات الجودة العالية", excerpt: "كيفية توفير خدمات فندقية متميزة لضيوفك وموظفيك.", fullContent: "تميز خدمات الضيافة الاستثنائية عملك عن المنافسين وتخلق انطباعات دائمة لدى الضيوف والموظفين. تشمل الضيافة الجودة على النظافة والاحترافية والاهتمام بالتفاصيل.\n\nتشمل العناصر الرئيسية للضيافة عالية الجودة:\n- الموظفون المحترفون والمهذبون\n- نظافة المنشأة النقية\n- المساحات المريحة والصيانة الجيدة\n- خدمة العملاء سريعة الاستجابة\n- الاهتمام بتفضيلات الضيوف\n- المرطبات والمرافق عالية الجودة\n- تدريب الموظفين والتطوير المنتظم\n- معايير الخدمة المتسقة\n\nالاستثمار في تميز الضيافة يدل على التزامك بالجودة وينشئ تجارب إيجابية تشجع الأعمال المتكررة والإحالات.", author: "ليلى محمود", category: "الخدمات الفندقية" },
      },
    ],
  },
  news: {
    items: [
      {
        id: "1",
        imageUrl: "/images/office-cleaning.png",
        date: "2025-02-10",
        en: {
          title: "Amaal Sahari Launches New Green Cleaning Initiative",
          excerpt: "We're committed to sustainable cleaning practices that protect the environment while maintaining the highest standards.",
          fullContent: "Amaal Sahari is proud to announce our new eco-friendly cleaning initiative. This groundbreaking program uses biodegradable products and sustainable practices to reduce environmental impact while delivering exceptional results. Our team has been specially trained in green cleaning techniques that are safe for both people and the planet.",
          author: "Sarah Ahmed",
          category: "Sustainability"
        },
        ar: {
          title: "أمال الصحاري تطلق مبادرة التنظيف الأخضر الجديدة",
          excerpt: "نحن ملتزمون بممارسات التنظيف المستدامة التي تحمي البيئة مع الحفاظ على أعلى المعايير.",
          fullContent: "يسرنا أن نعلن عن مبادرتنا الجديدة للتنظيف الصديق للبيئة. يستخدم هذا البرنامج المبتكر المنتجات القابلة للتحلل والممارسات المستدامة لتقليل التأثير البيئي مع تقديم نتائج استثنائية. تم تدريب فريقنا بشكل خاص على تقنيات التنظيف الأخضر.",
          author: "سارة أحمد",
          category: "الاستدامة"
        },
      },
      {
        id: "2",
        imageUrl: "/images/facility-management.png",
        date: "2025-02-05",
        en: {
          title: "Excellence in Facility Management Recognized",
          excerpt: "Amaal Sahari receives industry recognition for outstanding service quality and innovation.",
          fullContent: "We are honored to announce that Amaal Sahari has been recognized by the International Facility Management Association for excellence in service delivery. This award reflects our commitment to providing world-class facility management solutions that exceed client expectations.",
          author: "Mohammed Hassan",
          category: "Awards"
        },
        ar: {
          title: "التميز في إدارة المرافق معترف به",
          excerpt: "تحصل أمال الصحاري على اعتراف صناعي لجودة الخدمة والابتكار المتفوق.",
          fullContent: "يشرفنا الإعلان عن أن أمال الصحاري تم الاعتراف بها من قبل الرابطة الدولية لإدارة المرافق لتميزها في تقديم الخدمات. يعكس هذا الجائزة التزامنا بتقديم حلول إدارة مرافق عالمية المستوى تتجاوز توقعات العملاء.",
          author: "محمد حسن",
          category: "جوائز"
        },
      },
    ],
  },
  careers: {
    positions: [
      {
        id: "1",
        en: { title: "Operations Manager", department: "Operations", location: "Cairo, Egypt", description: "We're looking for an experienced Operations Manager to oversee our team and coordinate services efficiently." },
        ar: { title: "مدير العمليات", department: "العمليات", location: "القاهرة، مصر", description: "نحتاج إلى مدير عمليات ذو خبرة لإدارة فريقنا وتنسيق الخدمات بكفاءة." },
      },
      {
        id: "2",
        en: { title: "Cleaning Services Specialist", department: "Services", location: "Cairo, Egypt", description: "Join our specialized team providing advanced cleaning and maintenance services." },
        ar: { title: "متخصص في خدمات التنظيف", department: "الخدمات", location: "القاهرة، مصر", description: "انضم إلى فريقنا المتخصص في خدمات التنظيف والصيانة المتقدمة." },
      },
      {
        id: "3",
        en: { title: "HR Manager", department: "Human Resources", location: "Cairo, Egypt", description: "Seeking an HR Manager to handle recruitment and career development." },
        ar: { title: "مسؤول الموارد البشرية", department: "الموارد البشرية", location: "القاهرة، مصر", description: "ابحث عن مسؤول موارد بشرية لإدارة التوظيف والتطوير الوظيفي." },
      },
    ],
  },
  faqs: {
    items: [
      {
        id: "1",
        en: { question: "What cleaning services do you offer?", answer: "We offer comprehensive cleaning services including daily cleaning, deep cleaning, window and facade cleaning, and outdoor area management." },
        ar: { question: "ما هي خدمات التنظيف المتوفرة؟", answer: "نقدم مجموعة شاملة من خدمات التنظيف بما في ذلك التنظيف اليومي، والتنظيف العميق، وتنظيف النوافذ والواجهات، وإدارة المنطقة الخارجية." },
      },
      {
        id: "2",
        en: { question: "Do you provide security services?", answer: "Yes, we provide armed and unarmed security services, area surveillance, and security patrols to ensure your facility's safety." },
        ar: { question: "هل توفرون خدمات الأمن؟", answer: "نعم، نوفر خدمات الأمن المسلح وغير المسلح، ومراقبة المنطقة، والدوريات الأمنية لضمان سلامة مرفقك." },
      },
      {
        id: "3",
        en: { question: "Can services be customized to our needs?", answer: "Absolutely, we understand that each client has unique needs. We offer customized solutions tailored to your specific business requirements." },
        ar: { question: "هل يمكن تخصيص الخدمات حسب احتياجات��؟", answer: "بالتأكيد، نتفهم أن كل عميل له احتياجات فريدة. نقدم حلولاً مخصصة مصممة خصيصاً لتلبية متطلبات عملك." },
      },
      {
        id: "4",
        en: { question: "What are your service hours?", answer: "We operate 24/7. You can reach us anytime for immediate support and emergency services." },
        ar: { question: "ما هي ساعات عمل الخدمة؟", answer: "نحن نعمل على مدار 24 ساعة، 7 أ��ام في الأسبوع. يمكنك الاتصال بنا في أي وقت للحصول على الدعم الفوري والخدمات الطارئة." },
      },
      {
        id: "5",
        en: { question: "How can I get a quote?", answer: "You can contact us via phone or email, or fill out a form on our website. Our team will respond within 24 hours." },
        ar: { question: "كيف يمكنني الحصول على عرض سعر؟", answer: "يمكنك الاتصال بنا عبر الهاتف أو البريد الإلكتروني أو ملء نموذج على م��قعنا. سيقوم فريقنا بالاستجابة في غضون 24 ساعة." },
      },
      {
        id: "6",
        en: { question: "Do you provide guarantees on service quality?", answer: "Yes, we maintain high quality standards. If you're unsatisfied with any service, we'll correct it immediately at no additional cost." },
        ar: { question: "هل توفرون ضمانات على جودة الخدمة؟", answer: "نعم، نلتزم بمعايير جودة عالية. إذا لم تكن راضياً عن الخدمة، سنعمل ع������ى تصحيح الموقف فوراً بدون رسوم إضافية." },
      },
    ],
  },
  contact: {
    email: "info@amaalsahari.com",
    phone: "+201021454545",
    whatsapp: "+201021454545",
    address: {
      en: "United Arab Emirates",
      ar: "الإمارات العربية المتحدة",
    },
    locations: [
      {
        id: "1",
        phone: "+971 4 XXX XXXX",
        email: "dubai@softservices.ae",
        en: { city: "Dubai", address: "Dubai Business Center, Sheikh Zayed Road" },
        ar: { city: "دبي", address: "مركز دبي التجاري، شارع الشيخ زايد" },
      },
      {
        id: "2",
        phone: "+971 2 XXX XXXX",
        email: "abudhabi@softservices.ae",
        en: { city: "Abu Dhabi", address: "Union Tower, Al Marjan Island" },
        ar: { city: "أبو ظبي", address: "برج الاتحاد، جزيرة الماريه" },
      },
      {
        id: "3",
        phone: "+971 6 XXX XXXX",
        email: "sharjah@softservices.ae",
        en: { city: "Sharjah", address: "Industrial Area, Sharjah" },
        ar: { city: "الشارقة", address: "منطقة الصناعية، الشار��ة" },
      },
    ],
  },
  footer: {
    stats: [
      { id: "1", value: "500+", en: { label: "Sites Served" }, ar: { label: "المواقع المخدومة" } },
      { id: "2", value: "10,000+", en: { label: "Monthly Inspections" }, ar: { label: "الفحوصات الشهرية" } },
      { id: "3", value: "2 hours", en: { label: "Avg Response Time" }, ar: { label: "��ت��س�� وقت الاستجابة" } },
      { id: "4", value: "98%", en: { label: "Client Satisfaction" }, ar: { label: "رضا العملاء" } },
    ],
  },
  seo: {
    general: {
      defaultMetaTitle: "Amaal Sahari - Integrated Facility Management Solutions",
      defaultMetaDescription: "Comprehensive facility management services providing integrated workplace solutions that enhance productivity and comfort",
      metaKeywords: "facility management, cleaning services, security, workplace solutions",
      faviconUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amaal%20Sahari%20Web%20Logo-JeTkcT88yuJW3ZTgu8RnID1sBhHFbs.png",
    },
    pages: [],
    integrations: {
      googleSearchConsoleId: "",
      googleAnalyticsId: "",
      googleTagManagerId: "",
    },
  },
  whatsapp: {
    enabled: true,
    phoneNumber: "+201021454545",
    prefilledMessage: "Hello, I'm interested in your facility management services.",
    position: "right",
    customIconUrl: "",
  },
  socialMedia: {
    items: [
      { id: "1", platform: "facebook", enabled: true, url: "https://facebook.com", customIconUrl: "", position: "footer", openInNewTab: true },
      { id: "2", platform: "instagram", enabled: true, url: "https://instagram.com", customIconUrl: "", position: "footer", openInNewTab: true },
      { id: "3", platform: "linkedin", enabled: true, url: "https://linkedin.com", customIconUrl: "", position: "footer", openInNewTab: true },
      { id: "4", platform: "twitter", enabled: true, url: "https://twitter.com", customIconUrl: "", position: "footer", openInNewTab: true },
      { id: "5", platform: "youtube", enabled: true, url: "https://youtube.com", customIconUrl: "", position: "footer", openInNewTab: true },
    ],
  },
  navbar: {
    logo: {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amaal%20Sahari%20Web%20Logo-JeTkcT88yuJW3ZTgu8RnID1sBhHFbs.png",
      alt: "Amaal Sahari Logo",
      height: 48,
    },
    colors: {
      background: "#2F683E",
      text: "#FAFBF0",
      hover: "#FAB076",
      accent: "#EA8936",
    },
    navigation: {
      en: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/#services" },
        { label: "Projects", href: "/#projects" },
        { label: "Contact", href: "/contact" },
      ],
      ar: [
        { label: "الرئيسية", href: "/" },
        { label: "من نحن", href: "/about" },
        { label: "خدماتنا", href: "/#services" },
        { label: "مشاريعنا", href: "/#projects" },
        { label: "تواصل معنا", href: "/contact" },
      ],
    },
    cta: {
      en: "Get a Quote",
      ar: "احصل على عرض",
    },
  },
  homepageSections: {
    valueHighlights: {
      visible: true,
      en: { title: "Our Value Pillars" },
      ar: { title: "أعمدة قيمتنا" },
    },
    servicesVideo: {
      visible: true,
      en: { title: "Our Services" },
      ar: { title: "خدماتنا" },
    },
    kpis: {
      visible: true,
      en: { title: "By The Numbers" },
      ar: { title: "من خلال الأرقام" },
    },
    services: {
      visible: true,
      en: { title: "Our Services" },
      ar: { title: "خدماتنا" },
    },
    projects: {
      visible: true,
      en: { title: "Case Studies & Projects" },
      ar: { title: "دراسات الحالة والمشاريع" },
    },
    whyChooseUs: {
      visible: true,
      en: { title: "Why Choose Our Soft Services" },
      ar: { title: "لماذا تختار خدماتنا الناعمة" },
    },
    testimonials: {
      visible: true,
      en: { title: "What Our Clients Say" },
      ar: { title: "ما يقوله عملاؤنا" },
    },
    news: {
      visible: true,
      en: { title: "Latest News" },
      ar: { title: "آخر الأخبار" },
    },
  },
  animations: {
    aboutPageAnimationDelay: 100,
  },
}

interface ContentContextType {
  content: SiteContent
  updateContent: (newContent: Partial<SiteContent>) => void
  updateSection: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => void
  updateContact: (contact: SiteContent["contact"]) => void
  resetToDefault: () => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

const STORAGE_KEY = "site_content"
const DB_NAME = "SiteContentDB"
const STORE_NAME = "content"

// IndexedDB helper functions
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

const saveToIndexedDB = async (content: SiteContent): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.put(content, STORAGE_KEY)
      request.onsuccess = () => {
        console.log('[v0] Content saved to IndexedDB')
        resolve()
      }
      request.onerror = () => {
        console.error('[v0] IndexedDB save error:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('[v0] IndexedDB save failed:', e)
  }
}

const loadFromIndexedDB = async (): Promise<SiteContent | null> => {
  try {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.get(STORAGE_KEY)
      request.onsuccess = () => {
        if (request.result) {
          console.log('[v0] Content loaded from IndexedDB')
        }
        resolve(request.result || null)
      }
      request.onerror = () => {
        console.error('[v0] IndexedDB load error:', request.error)
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('[v0] IndexedDB load failed:', e)
    return null
  }
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent)

  useEffect(() => {
    // Load content from server (centralized) on mount, with fallbacks
    const loadContent = async () => {
      let contentLoaded = false

      // Step 1: Try loading from SERVER (centralized - primary source)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const response = await fetch('/api/content', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store'
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setContent({ ...defaultContent, ...result.data })
            console.log('[v0] Content loaded from SERVER (all users see same data)')
            contentLoaded = true
            return
          }
        }
      } catch (error) {
        console.warn('[v0] Server load attempt skipped (this is OK, will use local backup):', 
          error instanceof Error ? error.message : 'Unknown error')
      }

      if (contentLoaded) return

      // Step 2: Fallback to IndexedDB (local backup)
      try {
        const savedFromIndexedDB = await loadFromIndexedDB()
        if (savedFromIndexedDB) {
          setContent({ ...defaultContent, ...savedFromIndexedDB })
          console.log('[v0] Content loaded from IndexedDB (server unavailable)')
          return
        }
      } catch (e) {
        console.warn('[v0] IndexedDB load failed:', e)
      }
      
      // Step 3: Fallback to localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          setContent({ ...defaultContent, ...parsed })
          console.log('[v0] Content loaded from localStorage (server unavailable)')
          return
        }
      } catch (e) {
        console.warn('[v0] localStorage load failed:', e)
      }

      // Step 4: Use default content
      console.log('[v0] Using default content (no saved data found)')
      setContent(defaultContent)
    }

    loadContent()

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setContent({ ...defaultContent, ...parsed })
          console.log('[v0] Content updated from storage event')
        } catch (error) {
          console.error('[v0] Failed to parse storage update:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const saveContent = (newContent: SiteContent) => {
    setContent(newContent)
    
    // IMPORTANT: Save to SERVER first (persistent file storage for all users)
    const saveToServer = async (retryCount = 0): Promise<boolean> => {
      try {
        // Calculate payload size to warn about large uploads
        const payloadSize = new TextEncoder().encode(JSON.stringify({ data: newContent })).length
        const payloadSizeMB = (payloadSize / 1024 / 1024).toFixed(2)
        
        console.log(`[v0] Attempting server save (attempt ${retryCount + 1}/4) - Payload: ${payloadSizeMB}MB...`)
        
        // Increase timeout for larger payloads
        const timeout = Math.max(60000, Math.ceil(payloadSize / 100000) * 10000) // At least 60s, more for larger files
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: newContent }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          console.log(`[v0] ✓ Content PERMANENTLY saved to server disk in ${result.elapsedMs}ms - all users will see this update!`)
          
          // Verify by reading back from server
          try {
            const verifyResponse = await fetch('/api/content', { 
              method: 'GET',
              cache: 'no-store' 
            })
            if (verifyResponse.ok) {
              const verifyResult = await verifyResponse.json()
              if (verifyResult.success && verifyResult.data) {
                console.log('[v0] ✓ Save VERIFIED - server returned saved content')
              }
            }
          } catch (verifyErr) {
            console.warn('[v0] Could not verify save (content was still saved):', verifyErr)
          }
          
          return true
        } else {
          throw new Error(result.error || 'Server returned failure')
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        
        // Check if it's a timeout
        if (errorMsg.includes('abort') || errorMsg.includes('timeout')) {
          console.warn(`[v0] Server save attempt ${retryCount + 1} TIMED OUT after 60+ seconds`)
        } else {
          console.warn(`[v0] Server save attempt ${retryCount + 1} failed:`, errorMsg)
        }
        
        // Retry up to 3 times with increasing delay
        if (retryCount < 3) {
          const delay = (retryCount + 1) * 2000 // 2s, 4s, 6s (increased from 1-3s)
          console.log(`[v0] Retrying server save in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return saveToServer(retryCount + 1)
        }
        
        console.error('[v0] ✗ All server save attempts failed after 4 attempts - content may not persist after server restart')
        return false
      }
    }
    
    // Start server save (async, with retries) and wait for completion
    saveToServer().then((success) => {
      if (success) {
        console.log('[v0] Save workflow completed successfully')
      } else {
        console.warn('[v0] Save workflow completed with local-only storage')
      }
    })
    
    // Save to IndexedDB (local backup - supports up to 50MB+)
    saveToIndexedDB(newContent).catch((error) => {
      console.error('[v0] Failed to save to IndexedDB:', error)
    })

    // Also save to localStorage as fallback
    try {
      const serialized = JSON.stringify(newContent)
      localStorage.setItem(STORAGE_KEY, serialized)
      console.log('[v0] Content also saved to localStorage as safety fallback')
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.warn('[v0] localStorage quota exceeded, but data saved to server and IndexedDB')
      }
    }
  }

  const updateContent = (newContent: Partial<SiteContent>) => {
    const updated = { ...content, ...newContent }
    saveContent(updated)
  }

  const updateSection = <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => {
    // Apply cache busting to all image URLs when updating
    const bustData = bustImageCaches(data)
    saveContent({ ...content, [section]: bustData })
  }

  const updateContact = (contact: SiteContent["contact"]) => {
    const bustData = bustImageCaches(contact)
    saveContent({ ...content, contact: bustData })
  }

  const resetToDefault = () => {
    setContent(defaultContent)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        updateSection,
        updateContact,
        resetToDefault,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error("useContent must be used within ContentProvider")
  }
  return context
}
