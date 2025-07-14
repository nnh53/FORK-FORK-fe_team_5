import ctaImage from "@/assets/cta.png";
import { ROUTES } from "@/routes/route.constants";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "F Cinema",
  description: "A Movie Theater App.",
  cta: "Get Started",
  // url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173",
  keywords: ["AI Calendar", "Smart Scheduling", "Productivity", "Time Management"],
  links: {
    email: "support@calai.app",
    twitter: "https://twitter.com/calaiapp",
    discord: "https://discord.gg/calaiapp",
    github: "https://github.com/calaiapp",
    instagram: "https://instagram.com/calaiapp",
  },
  nav: {
    links: [
      { id: 1, name: "Home", href: "#home" },
      { id: 2, name: "Movies", href: "#movies" },
      { id: 3, name: "Trending", href: "#trending" },
      { id: 4, name: "Features", href: "#features" },
      { id: 5, name: "Chairs", href: "#chairs" },
      { id: 6, name: "FAQ", href: "#faq" },
    ],
  },
  featureSection: {
    title: "Simple. Seamless. Smart.",
    description: "Discover how SkyAgent transforms your commands into action in four easy steps",
    items: [
      {
        id: 1,
        title: "Ask Your AI Agent Directly",
        content: "Speak or type your command—let SkyAgent capture your intent. Your request instantly sets the process in motion.",
        image:
          "https://images.unsplash.com/photo-1720371300677-ba4838fa0678?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        title: "Let SkyAgent Process It",
        content: "We prioritize the needs and preferences of our users in our design process.",
        image:
          "https://images.unsplash.com/photo-1686170287433-c95faf6d3608?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8fA%3D%3D",
      },
      {
        id: 3,
        title: "Receive Instant, Actionable Results",
        content: "Our features seamlessly integrate with your existing systems for a smooth experience.",
        image:
          "https://images.unsplash.com/photo-1720378042271-60aff1e1c538?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 4,
        title: "Continuous Improvement",
        content: "We are constantly updating and improving our features to provide the best experience.",
        image:
          "https://images.unsplash.com/photo-1666882990322-e7f3b8df4f75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
      },
    ],
  },
  quoteSection: {
    quote:
      "SkyAgent has transformed our daily operations. Tasks that once consumed hours now complete in moments, freeing our team to focus on creativity and strategic growth.",
    author: {
      name: "Alex Johnson",
      role: "CTO, Innovatech",
      image: "https://randomuser.me/api/portraits/men/91.jpg",
    },
  },
  faqSection: {
    title: "Frequently Asked Questions",
    description: "Answers to common questions about SkyAgent and its features. If you have any other questions, please don't hesitate to contact us.",
    faQitems: [
      {
        id: 1,
        question: "What is an AI Agent?",
        answer:
          "An AI Agent is an intelligent software program that can perform tasks autonomously, learn from interactions, and make decisions to help achieve specific goals. It combines artificial intelligence and machine learning to provide personalized assistance and automation.",
      },
      {
        id: 2,
        question: "How does SkyAgent work?",
        answer:
          "SkyAgent works by analyzing your requirements, leveraging advanced AI algorithms to understand context, and executing tasks based on your instructions. It can integrate with your workflow, learn from feedback, and continuously improve its performance.",
      },
      {
        id: 3,
        question: "How secure is my data?",
        answer:
          "We implement enterprise-grade security measures including end-to-end encryption, secure data centers, and regular security audits. Your data is protected according to industry best practices and compliance standards.",
      },
      {
        id: 4,
        question: "Can I integrate my existing tools?",
        answer:
          "Yes, SkyAgent is designed to be highly compatible with popular tools and platforms. We offer APIs and pre-built integrations for seamless connection with your existing workflow tools and systems.",
      },
      {
        id: 5,
        question: "Is there a free trial available?",
        answer:
          "Yes, we offer a 14-day free trial that gives you full access to all features. No credit card is required to start your trial, and you can upgrade or cancel at any time.",
      },
      {
        id: 6,
        question: "How does SkyAgent save me time?",
        answer:
          "SkyAgent automates repetitive tasks, streamlines workflows, and provides quick solutions to common challenges. This automation and efficiency can save hours of manual work, allowing you to focus on more strategic activities.",
      },
    ],
  },
  ctaSection: {
    id: "cta",
    title: "Đến Với Chúng Tôi",
    backgroundImage: ctaImage,
    button: {
      text: "Đặt phim ngay",
      href: "/movies",
    },
    subtext: "Hủy vé bất cứ lúc nào, không cần lo lắng",
  },
  chairSection: {
    title: "Chair Experience",
    description: "Discover our premium seating options for the ultimate movie experience",
    chairs: [
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/75c58430-e8fe-4366-8047-8e3f63ab4048-normal.webp",
        alt: "Normal Chair",
        title: "Normal Chair",
      },
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/b44d4ed9-dae5-4a0d-80ce-1c14e777b9d1-vip.webp",
        alt: "VIP Chair",
        title: "VIP Chair",
      },
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/691f23ca-42f4-4fa8-a785-7a1f7127f90b-premium.webp",
        alt: "Premium Chair",
        title: "Premium Chair",
      },
      {
        imageSrc: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/86a5d757-c920-48bd-957e-ebd016c36cfb-couple.webp",
        alt: "Couple Chair",
        title: "Couple Chair",
      },
    ],
  },
  errorPage: {
    code: "404",
    label: "Error",
    title: "Sorry, we couldn't find this page.",
    button: "Back to Home",
  },
  internalServerErrorPage: {
    code: "500",
    label: "Server Error",
    title: "Oops! Something went wrong on our end.",
    button: "Back to Home",
  },
  adminTeamSection: {
    title: "Đội Ngũ Phát Triển",
    description: "Các thành viên FCinema.",
    cards: [
      { id: 1, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/a3a4e359-2ba6-47fb-aef4-c5b141789868-cuong.webp" },
      { id: 2, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/714dbf1c-a580-4586-96c8-f22e894541d9-hoang.webp" },
      { id: 3, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/0658ccab-ff6b-4eab-8eac-0890c4f93c3a-phat.webp" },
      { id: 4, img: "https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/bc051d33-b955-4e44-a19a-350b65c48d9b-tan.webp" },
      { id: 5, img: "" },
    ],
  },
  footer: {
    quickLinks: [
      { label: "Home", href: "#home" },
      { label: "Movies", href: "#movies" },
      { label: "Chairs", href: "#chairs" },
      { label: "Offers", href: "#offers" },
    ],
    supportLinks: [
      { label: "FAQs", href: "#faq" },
      { label: "Terms of Service", to: ROUTES.TERM_OF_SERVICE },
      { label: "Privacy Policy", to: ROUTES.PRIVACY_POLICY },
      { label: "Contact Us", href: "#" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
