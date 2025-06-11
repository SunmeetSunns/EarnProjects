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
    
  }
services = [
  {
    name: "Web Development (Frontend / Backend / Full-stack)",
    description: "Build fast, responsive websites and web apps using latest frontend, backend or full-stack technologies tailored to your business needs.",
    img: "../assets/images/web-dev.jpg"
  },
  {
    name: "Mobile App Development",
    description: "Create powerful Android and iOS apps with seamless performance and user-friendly interfaces using native or cross-platform tools.",
    img: "assets/images/mob-dev.webp"
  },
  {
    name: "UI/UX Design",
    description: "Design stunning interfaces and smooth user experiences that engage users and boost retention across web and mobile platforms.",
    img: "assets/images//ui-ux.webp"
  },
  {
    name: "Graphic Design / Branding",
    description: "Craft professional logos, brand identities, brochures, and more that leave a lasting impression on your audience.",
    img: "assets/images/graphic.jpeg"
  },
  {
    name: "SEO / SEM",
    description: "Improve your website’s visibility with search engine optimization and paid marketing to attract quality traffic and leads.",
    img: "assets/images/seo.jpeg"
  },
  {
    name: "Social Media Management",
    description: "Grow your online presence by managing posts, engagement, and strategy across all major social platforms.",
    img: "assets/images/social-mgmt.jpg"
  },
  {
    name: "Content Writing / Copywriting",
    description: "Get compelling blog posts, website content, and marketing copy that drives action and communicates value.",
    img: "assets/images/content.jpeg"
  },
  {
    name: "Video Editing / Animation",
    description: "Transform raw footage into engaging videos or animations that tell your brand story and boost viewer retention.",
    img: "assets/images/video-edit.jpeg"
  },
  {
    name: "Digital Marketing",
    description: "Run targeted digital campaigns that generate leads, build brand awareness, and maximize ROI across online channels.",
    img: "assets/images/digital-market.jpeg"
  },
  {
    name: "Data Analysis / Power BI / Excel",
    description: "Turn complex data into clear insights using tools like Excel and Power BI to drive informed decisions.",
    img: "assets/images/data-analysic.jpeg"
  },
  {
    name: "Virtual Assistant / Admin Support",
    description: "Get help with scheduling, data entry, research, and daily admin tasks to free up your time and boost productivity.",
    img: "assets/images/admin-sprt.webp"
  }
];

}
