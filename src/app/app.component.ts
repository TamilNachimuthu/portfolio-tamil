import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from './reveal.directive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup {
  label: string;
  items: string[];
}

interface SkillDisplay {
  name: string;
  icon: string;
  category: string;
}

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  duration: string;
  points: string[];
}

interface ProjectItem {
  name: string;
  tagline: string;
  stack: string[];
  points: string[];
  featured?: boolean;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sparkline') sparklineRef?: ElementRef<SVGPathElement>;
  @ViewChild('statNodes') statNodesRef?: ElementRef<HTMLElement>;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  readonly year = new Date().getFullYear();
  menuOpen = false;
  scrolled = false;

  readonly sectionIds = [
    'home',
    'about',
    'skills',
    'experience',
    'projects',
    'contact',
  ];
  activeSection = '';
  private sectionObserver?: IntersectionObserver;

  readonly roles = [
    'Senior Software Engineer',
    'React.js & Next.js Developer',
    'Frontend Systems Engineer',
    'Web Application Developer',
  ];
  roleIndex = 0;
  typedRole = '';
  private typeTimer: any;
  private isDeletingRole = false;

  displayStats: number[] = [];

  stats = [
    { value: 5, suffix: '+', label: 'YEARS EXPERIENCE' },
    { value: 10, suffix: '+', label: 'PRODUCTS SHIPPED' },
    { value: 4, suffix: '', label: 'PORTALS IN ONE PLATFORM' },
    { value: 2, suffix: '', label: 'PERFORMANCE AWARDS' },
  ];

  // Maps each skill name to its local logo file under assets/skills/.
  private readonly skillIconMap: Record<string, string> = {
    'React.js': 'react.svg',
    'Next.js': 'nextjs.svg',
    Angular: 'angular.svg',

    JavaScript: 'javascript.svg',
    TypeScript: 'typescript.svg',
    Redux: 'redux.svg',
    jQuery: 'jquery.svg',
    'REST APIs': 'rest-api.svg',
    HTML5: 'html5.svg',

    Formik: 'formik.svg',

    'Tailwind CSS': 'tailwindcss.svg',
    Bootstrap: 'bootstrap.svg',
    Flowbite: 'flowbite.svg',
    'Material UI (MUI)': 'mui.svg',
    CSS3: 'css3.svg',
    SCSS: 'scss.svg',

    Animations: 'animations.svg',
    GSAP: 'gsap.svg',

    'Chart.js': 'chartjs.svg',
    ApexCharts: 'apexcharts.svg',

    Git: 'git.svg',
    GitHub: 'github.svg',
    Jira: 'jira.svg',
    'Agile / Scrum': 'agile-scrum.svg',

    MySQL: 'mysql.svg',

    Figma: 'figma.svg',
  };

  /** Returns the local logo path for a given skill name, falling back to a generic mark. */
  skillIcon(name: string): string {
    const file = this.skillIconMap[name] ?? 'generic.svg';
    return `assets/skills/${file}`;
  }

  readonly skillGroups: SkillGroup[] = [
    {
      label: 'Frameworks & Libraries',
      items: ['Angular', 'React.js', 'Next.js', 'Redux', 'jQuery', 'REST APIs'],
    },

    {
      label: 'Languages',
      items: [
        'JavaScript',
        'TypeScript',
        'Formik',
        'Chart.js',
        'ApexCharts',
        'HTML5',
      ],
    },

    {
      label: 'UI & Styling',
      items: [
        'Tailwind CSS',
        'Bootstrap',
        'Flowbite',
        'Material UI (MUI)',
        'CSS3',
        'SCSS',
        'GSAP',
        'Animations',
      ],
    },

    {
      label: 'Tools & Workflow',
      items: ['Git', 'GitHub', 'Jira', 'Agile / Scrum', 'MySQL', 'Figma'],
    },
  ];

  // Flattened list of every skill, used to render a single ungrouped grid of boxes.
  readonly allSkills: string[] = this.skillGroups.flatMap((g) => g.items);

  // Text typed into the skills filter box (top-right of the "Technical toolkit" header).
  skillFilter = '';

  get filteredSkills(): string[] {
    const query = this.skillFilter.trim().toLowerCase();
    if (!query) {
      return this.allSkills;
    }
    return this.allSkills.filter((skill) =>
      skill.toLowerCase().includes(query),
    );
  }

  readonly experience: ExperienceItem[] = [
    {
      role: 'Senior Software Engineer',
      company: 'Cloudrevel Innovations Pvt Ltd',
      period: 'Mar 2023 — Present',
      duration: '4+ Years',
      points: [
        'Led frontend development for enterprise-grade web applications using React.js, Next.js, TypeScript, and JavaScript, delivering scalable, maintainable, and high-performance solutions.',
        'Designed and developed responsive, pixel-perfect user interfaces from Figma designs while ensuring accessibility, cross-browser compatibility, and mobile responsiveness.',
        'Built feature-rich HRMS, Property Management, Fintech, and Cloud Hosting platforms with role-based access control, multi-portal architecture, and dynamic business workflows.',
        'Developed interactive dashboards using Chart.js and ApexCharts to visualize real-time analytics, employee metrics, reports, approvals, and business insights.',
        'Integrated secure REST APIs, authentication systems, and third-party services, enabling seamless communication between frontend and backend applications.',
        'Implemented reusable components, optimized rendering performance, and improved application scalability using modern frontend architecture and best practices.',
        'Enhanced website performance through code optimization, lazy loading, image optimization, SEO improvements, and responsive design techniques.',
        'Created engaging user experiences with GSAP animations, interactive UI components, and smooth page transitions across multiple enterprise applications.',
        'Collaborated closely with UI/UX designers, backend developers, QA engineers, and product managers in Agile/Scrum environments to deliver high-quality software within sprint timelines.',
        'Mentored team members through code reviews, shared frontend best practices, and contributed to maintaining clean, reusable, and scalable codebases.',
        'Recognized with Employee of the Month and Best Performer awards for consistently delivering high-quality solutions, meeting critical project deadlines, and contributing to successful product releases.',
      ],
    },
    {
      role: 'Junior Software Engineer',
      company: 'InfoVision Labs India Pvt Ltd',
      period: 'Oct 2021 — Mar 2023',
      duration: '1.5 yrs',
      points: [
        'Developed and maintained responsive, user-friendly websites using HTML5, CSS3, JavaScript, jQuery, React.js, and Bootstrap, ensuring consistent performance across modern browsers and devices.',
        'Converted UI/UX designs and wireframes into pixel-perfect, responsive web pages while following modern web standards and accessibility best practices.',
        'Collaborated with senior developers and designers to implement new features, enhance user interfaces, and deliver high-quality solutions within project timelines.',
        'Integrated REST APIs to display dynamic content and improve application functionality, ensuring seamless communication between frontend and backend systems.',
        'Resolved UI/UX issues, fixed cross-browser compatibility problems, and optimized layouts to improve usability and customer satisfaction.',
        'Improved website performance through code optimization, responsive design techniques, image optimization, and reusable component development.',
        'Participated in debugging, testing, and quality assurance activities to identify issues early and ensure stable, reliable application releases.',
        'Worked in an Agile development environment, actively participating in sprint planning, daily stand-ups, code reviews, and team discussions to deliver projects efficiently.',
        'Gained hands-on experience with version control using Git, collaborating with team members, and following industry best practices for frontend development.',
        'Built a strong foundation in modern web development, responsive design, API integration, and collaborative software development practices while contributing to multiple client projects.',
      ],
    },
  ];

  readonly projects: ProjectItem[] = [
    {
      name: 'Property Management',
      tagline: 'AI-powered property management platform',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind',
        'Flowbite',
        'Redux',
        'Formik',
        'SEO',
        'REST APIs',
        'Claude AI',
      ],
      points: [
        'Developed a full-featured property management platform with dedicated portals for Super Admin, Off-Plan Admin, Vendors, Property Owners, and Tenants.',
        'Enabled property buying, selling, leasing, tenant-owner communication, multi-stage approval workflows, and service request management within a single platform.',
        'Integrated Claude AI to analyze and compare current and previous utility bills, identify cost increases and decreases, provide bill insights, and generate recommendations to help users reduce energy and utility expenses.',
      ],
      featured: true,
    },
    {
      name: 'HRMS',
      tagline: 'Enterprise Human Resource Management System',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'SASS',
        'Chart.js',
        'REST API',
        'Formik',
      ],
      points: [
        'Developed a comprehensive Human Resource Management System (HRMS) with role-based portals for Super Admin, HR, Managers, and Employees.',
        'Implemented employee onboarding, attendance tracking, leave management, payroll, payslips, exit management, performance reviews, and document management.',
        'Built interactive dashboards using Chart.js to visualize employee statistics, attendance trends, leave analytics, department performance, and HR reports in real time.',
        'Integrated REST APIs for employee management, authentication, notifications, and payroll processing with secure role-based access control.',
        'Developed multi-step forms using Formik with validation for employee onboarding, leave requests, reimbursements, and profile management.',
        'Optimized application performance using Next.js features, resulting in faster page loads and an improved user experience.',
      ],
      featured: true,
    },
    {
      name: 'Fintech',
      tagline: 'Static Website for a Rural Fintech Platform',
      stack: ['Next.js', 'TypeScript', 'Bootstrap', 'GSAP', 'SEO', 'SEO'],
      points: [
        'Developed a modern, responsive marketing website for a rural fintech platform using Next.js and TypeScript.',
        'Translated UI/UX designs into pixel-perfect, mobile-friendly pages with a consistent user experience across devices.',
        'Implemented smooth GSAP animations and interactive scrolling effects to enhance user engagement.',
        'Optimized page performance with responsive layouts, image optimization, and reusable components for fast loading and maintainability.',
        'Built SEO-friendly pages to improve search engine visibility and effectively showcase the platform’s services and brand.',
        'Collaborated with designers and stakeholders to deliver a high-quality website within project timelines.',
      ],
    },
    {
      name: 'Hosting',
      tagline: 'Domain Registration & Hosting Platform',
      stack: ['Next.js', 'TypeScript', 'Bootstrap', 'GSAP', 'REST APIs', 'SEO'],
      points: [
        'Developed a modern hosting platform for domain registration, web hosting, and cloud infrastructure services.',
        'Integrated domain name search and availability checking through domain registrar APIs, allowing users to search and register available domains in real time.',
        'Built responsive pages for hosting plans, VPS, cloud hosting, SSL certificates, email hosting, and domain management.',
        'Implemented smooth GSAP animations and interactive UI components to create an engaging and user-friendly experience.',
        'Optimized website performance using Next.js features, responsive layouts, reusable components, and SEO best practices for faster page loading.',
        'Collaborated with designers and backend developers to deliver a scalable, high-performance hosting platform with a seamless user experience.',
      ],
    },
    {
      name: 'E-commerce',
      tagline: 'Multi-Vendor E-commerce Platform',
      stack: [
        'React.js',
        'PHP',
        'JavaScript',
        'Tailwind CSS',
        'CSS3',
        'API Integration',
        'Formik',
        'SEO',
      ],
      points: [
        'Developed a complete e-commerce platform with separate Admin and Customer portals, providing a seamless shopping and management experience.',
        'Built an Admin Dashboard to manage products, categories, brands, inventory, discounts, coupons, orders, customers, and sales reports.',
        'Implemented customer features including product search, filtering, wishlist, shopping cart, secure checkout, order tracking, and user profile management.',
        'Integrated REST APIs for product management, user authentication, order processing, inventory updates, and payment workflows.',
        'Developed dynamic forms using Formik with client-side validation for product management, customer registration, and checkout.',
        'Optimized the platform for SEO, responsive design, and high performance, ensuring fast loading times and an excellent user experience across desktop and mobile devices.',
      ],
    },
    {
      name: 'Restaurant',
      tagline: 'Multi-Restaurant Food Ordering Platform',
      stack: [
        'HTML5',
        'CSS3',
        'SCSS',
        'JavaScript',
        'jQuery',
        'PHP',
        'Laravel',
        'API Integration',
      ],
      points: [
        'Developed a multi-restaurant platform with dedicated Admin, Restaurant Owner, Customer, and Delivery Partner portals.',
        'Implemented restaurant onboarding, menu management, table reservations, online food ordering, takeaway, and pickup services.',
        'Built order management, real-time order tracking, delivery partner assignment, and order status updates.',
        'Integrated REST APIs for user authentication, restaurant management, menu operations, order processing, and notifications.',
        'Designed responsive and user-friendly interfaces using HTML5, CSS3, SCSS, JavaScript, and jQuery.',
        'Collaborated with the backend team to develop scalable features using PHP and Laravel while ensuring a seamless user experience.',
      ],
    },
    {
      name: 'Ticket System',
      tagline: 'Customer  & Ticket Management Platform',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'API Integration',
        'Formik',
      ],
      points: [
        'Developed a comprehensive ticket management platform for creating, tracking, assigning, and resolving customer requests.',
        'Implemented role-based portals for Admin,  Agents, and Customers with dedicated workflows and access permissions.',
        'Built ticket creation, categorization, priority management, status tracking, assignment, escalation, and resolution workflows to streamline  operations.',
        'Developed interactive dashboards to monitor ticket volumes, open and closed tickets, response times, priorities, and  team performance.',
        'Integrated REST APIs for ticket management, user authentication, comments, attachments, notifications, and real-time ticket status updates.',
        'Implemented responsive, reusable UI components and optimized application performance to provide a seamless  experience across desktop and mobile devices.',
      ],
    },
    {
      name: 'Finance Operations',
      tagline: 'Enterprise Finance & Expense Management Platform',
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'API Integration',
        'Formik',
      ],
      points: [
        'Developed a comprehensive Finance Operations platform to manage income, expenses, transactions, budgets, invoices, and financial records.',
        'Implemented role-based access control for Admin, Finance Managers, and Employees with secure access to financial data and workflows.',
        'Built interactive dashboards using Chart.js to visualize revenue, expenses, cash flow, budgets, and financial performance through real-time analytics.',
        'Developed modules for expense tracking, invoice management, payment records, approvals, and financial reporting to streamline finance operations.',
        'Integrated REST APIs for transaction management, authentication, financial records, notifications, and report generation.',
        'Implemented reusable forms with Formik and validation while optimizing the application for performance, responsiveness, and a seamless user experience.',
      ],
    },
  ];

  readonly otherProjects = [
    { name: 'Static Site', desc: 'Static marketing site for a fintech brand' },
    { name: 'Gaming', desc: 'Sports prediction & gaming app' },

    {
      name: 'Asset Management System',
      desc: 'Track & manage organizational assets',
    },
    { name: 'Company Web Site', desc: 'Static company website' },
  ];

  readonly achievements = [
    {
      title: 'Employee of the Month',
      org: 'Cloudrevel Innovations Pvt Ltd',
      desc: 'Recognized for exceptional performance, strong commitment, and valuable contributions to the success of key projects.',
    },
    {
      title: 'Best Performer of the Year',
      org: 'Cloudrevel Innovations Pvt Ltd',
      desc: 'Recognized for outstanding performance, consistent excellence, and meaningful contributions to the organization.',
    },
  ];

  ngOnInit(): void {
    this.displayStats = this.stats.map(() => 0);
  }

  ngAfterViewInit(): void {
    // Run first and unconditionally — a failure anywhere else must never
    // prevent the typing effect from starting.
    this.startTyping();

    try {
      this.playIntro();
    } catch (err) {
      console.error('playIntro failed:', err);
      this.animateStatCounters();
    }

    try {
      this.observeSections();
    } catch (err) {
      console.error('observeSections failed:', err);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typeTimer);
    this.sectionObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 12;
    this.updateActiveSection();
  }
  private updateActiveSection(): void {
    const scrollPosition = window.scrollY + 120;

    // At the very top, Home should always be active.
    if (window.scrollY < 100) {
      this.activeSection = 'home';
      return;
    }

    let currentSection = 'home';

    for (const id of this.sectionIds) {
      const section = document.getElementById(id);

      if (!section) continue;

      const sectionTop = section.offsetTop;

      if (scrollPosition >= sectionTop) {
        currentSection = id;
      } else {
        break;
      }
    }

    if (this.activeSection !== currentSection) {
      this.zone.run(() => {
        this.activeSection = currentSection;
        this.cdr.detectChanges();
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  private startTyping(): void {
    const step = () => {
      const word = this.roles[this.roleIndex];
      if (!this.isDeletingRole) {
        this.typedRole = word.slice(0, this.typedRole.length + 1);
        if (this.typedRole === word) {
          this.isDeletingRole = true;
          this.typeTimer = setTimeout(step, 1600);
          this.cdr.detectChanges();
          return;
        }
        this.typeTimer = setTimeout(step, 55);
      } else {
        this.typedRole = word.slice(0, this.typedRole.length - 1);
        if (this.typedRole === '') {
          this.isDeletingRole = false;
          this.roleIndex = (this.roleIndex + 1) % this.roles.length;
          this.typeTimer = setTimeout(step, 300);
          this.cdr.detectChanges();
          return;
        }
        this.typeTimer = setTimeout(step, 30);
      }
      this.cdr.detectChanges();
    };
    this.zone.run(() => {
      this.typeTimer = setTimeout(step, 400);
    });
  }

  private observeSections(): void {
    const sections = this.sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      this.activeSection = this.sectionIds[0];
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (visibleSections.length) {
          this.zone.run(() => {
            this.activeSection = visibleSections[0].target.id;
            this.cdr.detectChanges();
          });
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      this.sectionObserver!.observe(section);
    });
  }
  private playIntro(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.js-hero-boot', { opacity: 0, y: 8, duration: 0.5 })
      .from('.js-hero-name', { opacity: 0, y: 24, duration: 0.7 }, '-=0.15')
      .from('.js-hero-role', { opacity: 0, y: 14, duration: 0.5 }, '-=0.35')
      .from('.js-hero-copy', { opacity: 0, y: 14, duration: 0.5 }, '-=0.3')
      .from('.js-hero-cta', { opacity: 0, y: 10, duration: 0.5 }, '-=0.3')
      .from('.js-hero-panel', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5');

    const path = this.sparklineRef?.nativeElement;
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(
        path,
        { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' },
        '-=0.4',
      );
    }

    // Only start counting once the metrics panel is actually fully visible —
    // splicing this into the intro timeline above (via relative position
    // labels) let the count finish before the panel had even faded in,
    // which just looked like the numbers popping in instead of counting up.
    tl.eventCallback('onComplete', () => this.animateStatCounters());
  }

  private animateStatCounters(): void {
    this.stats.forEach((stat, idx) => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value,
        duration: 1.2,
        ease: 'power1.out',
        delay: idx * 0.1,
        onUpdate: () => {
          this.displayStats[idx] =
            stat.value % 1 !== 0
              ? Number(obj.val.toFixed(1))
              : Math.round(obj.val);
          this.cdr.detectChanges();
        },
      });
    });
  }
}
