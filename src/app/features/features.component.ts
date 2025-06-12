import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit{
  ngOnInit(): void {
     this.services = [...this.services, ...this.services]; 
  }
services = [
  {
    name: "IT & Software Development Projects",
    description: "Engineer powerful digital solutions for real clients. Note: These projects demand real skills and deliver serious impact. Build tools and platforms that shape tomorrow.",
    subProjects: [
      "Mobile App Development – Flutter, React Native, Kotlin, Swift",
      "Web App Development – React, Angular, Next.js, Django, Laravel",
      "ERP/CRM Systems – HRMS, Sales CRM, Inventory tools",
      "Blockchain Development – Smart contracts, NFT platforms, DeFi systems",
      "Metaverse Projects – Virtual spaces using Unity, Web3 integration",
      "AI Development – Custom chatbots, AI copilots, LLM-based apps (GPT, LangChain)",
      "Game Development – 2D/3D games using Unity, Godot, WebGL"
    ],
    img:"assets/images/software_dev.jpg"
  },
  {
    name: "Data Science, Engineering & Analytics Projects",
    description: "From data pipelines to machine learning — get hired for deep analytical work. Note: Deliver insight-driven decisions for global clients using enterprise tools.",
    subProjects: [
      "Data Engineering – ETL/ELT pipelines, Airflow, Spark, dbt, GCP, AWS",
      "Data Analysis – KPI dashboards, Excel/SQL/Python-based reports",
      "Data Modeling – Schema designs (Star, Snowflake), ER diagrams",
      "Machine Learning – Classification, recommendation, forecasting models",
      "NLP & AI – Sentiment analysis, chatbot training, summarization (spaCy, HuggingFace)",
      "BI Dashboards – Tableau, Power BI, Looker, custom analytics",
      "Big Data Processing – Kafka, Snowflake, BigQuery"
    ],
     img:"assets/images/data-analytics.jpg"
  },
  {
    name: "Digital Branding & Marketing Projects",
    description: "Run campaigns that grow real brands — trackable, strategic, ROI-focused. Note: Work directly with startup founders, CMOs, and agencies building global brands.",
    subProjects: [
      "Performance Marketing – Google Ads, Meta Ads, retargeting",
      "SEO – Technical SEO, backlinking, keyword strategy",
      "Email Campaigns – Automation, nurture sequences, campaign analytics",
      "Influencer Campaigns – Coordination, outreach, performance reporting",
      "Funnel Strategy – Zapier, Pabbly, CRM automation",
      "Social Media Strategy – Content calendars, performance reports",
      "Analytics – UTM tracking, ad spend ROI, customer behavior analysis"
    ],
     img:"assets/images/digitalMar.jpeg"
  },
  {
    name: "Design, UI/UX & 3D Projects",
    description: "Design for utility, beauty, and interaction — across web, mobile, and immersive experiences. Note: Go beyond static designs — shape what people see and experience in digital and virtual worlds.",
    subProjects: [
      "UI/UX Design – Wireframes, mockups, user flows using Figma/Sketch/XD",
      "Responsive Web & Landing Page Design – Mobile-first, CRO-optimized",
      "Brand Identity – Logos, typography, design systems, style guides",
      "3D Modeling – Product, architectural, and gaming models (Blender, Maya)",
      "Rendering – High-quality 3D renderings and animations",
      "Game Asset Design – Sprites, interfaces, objects for Unity/Unreal",
      "Metaverse Design – Avatars, virtual space UI, immersive experiences"
    ],
     img:"assets/images/design.png"
  },
  {
    name: "Content Creation, Copywriting & Writing Projects",
    description: "Use your words to inform, persuade, and convert real audiences. Note: Help clients grow their authority, SEO, and conversions through writing.",
    subProjects: [
      "SEO Content – High-ranking articles, niche blog posts",
      "Conversion Copywriting – Landing pages, product descriptions, ads",
      "Email Copy – Funnels, launches, onboarding campaigns",
      "Technical Writing – Docs, user manuals, whitepapers",
      "LinkedIn Ghostwriting – Founder branding and lead gen",
      "Scriptwriting – YouTube, reels, podcast episodes",
      "Brand Messaging – Taglines, tone guides, storytelling frameworks"
    ],
     img:"assets/images/content-market.png"
  },
  {
    name: "Sales & Business Development Projects",
    description: "Learn how real business works — from lead gen to closing deals. Note: Get trained while working on revenue-driving activities in live business environments.",
    subProjects: [
      "Lead Generation – LinkedIn scraping, Apollo, Crunchbase",
      "Cold Outreach – Email writing, call scripts, personalization",
      "CRM Management – HubSpot, Salesforce, Zoho tracking",
      "Demo Booking – Qualification and scheduling for B2B meetings",
      "Proposal & Decks – Sales collateral creation",
      "Upsell & Client Relationship – Renewals, client experience,etc",
      "Funnel Building – Sales pipelines, lead tracking"
    ],
     img:"assets/images/bussiness-dev.webp"
  }
];


}
