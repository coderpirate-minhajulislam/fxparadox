import { Head, Link, usePage } from '@inertiajs/react';
import {
    TrendingUp, BarChart3, Shield, Target, LineChart,
    ArrowRight, ChevronRight, Activity, Zap,
    Sun, Moon, Menu, X, Download, Award,
    Phone, Mail, MapPin, Quote, PieChart, Globe, DollarSign,
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import type { SiteContentValues } from '@/types/site-content';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    TrendingUp, BarChart3, Shield, Zap, Target, LineChart, Activity,
    ArrowRight, ChevronRight, Award, PieChart, Globe, DollarSign,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = iconMap[name] || Zap;
    return <Icon className={className} />;
}

function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, isVisible } = useScrollAnimation();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function SlideInLeft({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, isVisible } = useScrollAnimation();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function SlideInRight({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, isVisible } = useScrollAnimation();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function ScaleIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, isVisible } = useScrollAnimation();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

type Props = {
    contents: SiteContentValues;
    canRegister: boolean;
    auth: { user: { id: number } | null };
};

export default function Home() {
    const { contents = {}, canRegister, auth } = usePage<Props>().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const deferredPrompt = useRef<any>(null);
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            deferredPrompt.current = e;
            setCanInstall(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt.current) return;
        deferredPrompt.current.prompt();
        const result = await deferredPrompt.current.userChoice;
        if (result.outcome === 'accepted') setCanInstall(false);
        deferredPrompt.current = null;
    };

    const hero = contents.hero ?? {};
    const stats = contents.stats ?? {};
    const services = contents.services ?? {};
    const about = contents.about ?? {};
    const testimonials = contents.testimonials ?? {};
    const cta = contents.cta ?? {};
    const footer = contents.footer ?? {};
    const contact = contents.contact ?? {};

    const statsData = [
        { value: stats.stat_1_value ?? '$2.5B+', label: stats.stat_1_label ?? 'Assets Under Management' },
        { value: stats.stat_2_value ?? '12+', label: stats.stat_2_label ?? 'Years of Excellence' },
        { value: stats.stat_3_value ?? '10,000+', label: stats.stat_3_label ?? 'Active Investors' },
        { value: stats.stat_4_value ?? '94%', label: stats.stat_4_label ?? 'Client Satisfaction' },
    ];

    const servicesData = [
        { icon: services.service_1_icon ?? 'PieChart', title: services.service_1_title ?? 'Index Tracking', description: services.service_1_description ?? '' },
        { icon: services.service_2_icon ?? 'Target', title: services.service_2_title ?? 'Stock Portfolio', description: services.service_2_description ?? '' },
        { icon: services.service_3_icon ?? 'TrendingUp', title: services.service_3_title ?? 'Growth Analytics', description: services.service_3_description ?? '' },
        { icon: services.service_4_icon ?? 'Shield', title: services.service_4_title ?? 'Risk Management', description: services.service_4_description ?? '' },
    ];

    const testimonialsData = [
        { name: testimonials.testimonial_1_name ?? 'Marcus Chen', role: testimonials.testimonial_1_role ?? 'Portfolio Manager', quote: testimonials.testimonial_1_quote ?? '' },
        { name: testimonials.testimonial_2_name ?? 'Sarah Williams', role: testimonials.testimonial_2_role ?? 'Fund Manager', quote: testimonials.testimonial_2_quote ?? '' },
        { name: testimonials.testimonial_3_name ?? 'James Rodriguez', role: testimonials.testimonial_3_role ?? 'Independent Investor', quote: testimonials.testimonial_3_quote ?? '' },
    ];

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <Head title={hero.title ?? 'FX Paradox'} />
            <div className="min-h-screen bg-background text-foreground">

                {/* Navbar */}
                <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-9 sm:w-9">
                                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <span className="text-lg font-bold sm:text-xl">FX Paradox</span>
                        </Link>

                        <div className="hidden items-center gap-6 sm:flex">
                            <a href="#services" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Services</a>
                            <a href="#about" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">About</a>
                            <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Testimonials</a>
                            <a href="#contact" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Contact</a>
                            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-accent" aria-label="Toggle theme">
                                {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            {auth?.user ? (
                                <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                    Dashboard <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent">Log in</Link>
                                    {canRegister && (
                                        <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                            Get Started <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 sm:hidden">
                            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-accent" aria-label="Toggle theme">
                                {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-accent" aria-label="Toggle menu">
                                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-t border-border/50 bg-background px-4 py-4 sm:hidden">
                            <div className="flex flex-col gap-2">
                                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent">Services</a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent">About</a>
                                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent">Testimonials</a>
                                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent">Contact</a>
                                {auth?.user ? (
                                    <Link href="/dashboard" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                        Dashboard <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="w-full rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-accent">Log in</Link>
                                        {canRegister && (
                                            <Link href="/register" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                                                Get Started <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24 lg:py-36">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
                            <div className="max-w-2xl">
                                {hero.subtitle && (
                                    <FadeIn>
                                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                                            <Activity className="h-3.5 w-3.5" />
                                            {hero.subtitle}
                                        </div>
                                    </FadeIn>
                                )}
                                <FadeIn delay={100}>
                                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                                        {hero.title ?? 'Smart Investing in Indices & Stocks'}
                                    </h1>
                                </FadeIn>
                                <FadeIn delay={200}>
                                    <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
                                        {hero.description ?? 'Professional-grade analytics and portfolio management tools.'}
                                    </p>
                                </FadeIn>
                                <FadeIn delay={300}>
                                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                        <Link
                                            href={auth?.user ? '/dashboard' : (hero.button_link ?? '/register')}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:text-base"
                                        >
                                            {hero.button_text ?? 'Start Investing Today'}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <a
                                            href="#services"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 text-sm font-semibold transition hover:bg-accent sm:text-base"
                                        >
                                            Explore Services
                                            <ChevronRight className="h-4 w-4" />
                                        </a>
                                    </div>
                                </FadeIn>
                            </div>
                            <div className="relative hidden lg:block">
                                <SlideInRight>
                                    {hero.image ? (
                                        <img src={`/storage/${hero.image}`} alt="FX Paradox" className="w-full rounded-2xl border shadow-2xl shadow-primary/10" />
                                    ) : (
                                        <div className="relative rounded-2xl border bg-card/50 p-8 shadow-2xl shadow-primary/10">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="rounded-xl border bg-background p-4">
                                                    <TrendingUp className="mb-2 h-8 w-8 text-green-500" />
                                                    <div className="text-2xl font-bold">+24.5%</div>
                                                    <div className="text-xs text-muted-foreground">YTD Return</div>
                                                </div>
                                                <div className="rounded-xl border bg-background p-4">
                                                    <BarChart3 className="mb-2 h-8 w-8 text-blue-500" />
                                                    <div className="text-2xl font-bold">1,247</div>
                                                    <div className="text-xs text-muted-foreground">Stocks Tracked</div>
                                                </div>
                                                <div className="rounded-xl border bg-background p-4">
                                                    <Globe className="mb-2 h-8 w-8 text-primary" />
                                                    <div className="text-2xl font-bold">15+</div>
                                                    <div className="text-xs text-muted-foreground">Global Indices</div>
                                                </div>
                                                <div className="rounded-xl border bg-background p-4">
                                                    <Shield className="mb-2 h-8 w-8 text-amber-500" />
                                                    <div className="text-2xl font-bold">2.4</div>
                                                    <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </SlideInRight>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-y border-border/50 bg-card/50 py-8 sm:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
                            {statsData.map((stat, i) => (
                                <FadeIn key={i} delay={i * 100}>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">{stat.value}</div>
                                        <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className="py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <FadeIn>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                    {services.title ?? 'Comprehensive Investment Solutions'}
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                                    {services.description ?? 'Tools and insights for success in indices and stock investing.'}
                                </p>
                            </div>
                        </FadeIn>
                        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
                            {servicesData.map((service, i) => (
                                <ScaleIn key={i} delay={i * 100}>
                                    <div className="group h-full rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-14 sm:w-14">
                                            <DynamicIcon name={service.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold">{service.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                                    </div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="about" className="border-y border-border/50 bg-accent/30 py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
                            <SlideInLeft className="order-2 lg:order-1">
                                {about.image ? (
                                    <img src={`/storage/${about.image}`} alt="About FX Paradox" className="w-full rounded-2xl border shadow-xl" />
                                ) : (
                                    <div className="rounded-2xl border bg-card p-8 shadow-xl">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-xl bg-primary/5 p-4 text-center">
                                                <Award className="mx-auto mb-2 h-8 w-8 text-primary" />
                                                <div className="text-sm font-semibold">Award Winning</div>
                                                <div className="text-xs text-muted-foreground">Platform 2024</div>
                                            </div>
                                            <div className="rounded-xl bg-primary/5 p-4 text-center">
                                                <Shield className="mx-auto mb-2 h-8 w-8 text-primary" />
                                                <div className="text-sm font-semibold">Regulated</div>
                                                <div className="text-xs text-muted-foreground">& Compliant</div>
                                            </div>
                                            <div className="rounded-xl bg-primary/5 p-4 text-center">
                                                <Globe className="mx-auto mb-2 h-8 w-8 text-primary" />
                                                <div className="text-sm font-semibold">Global Markets</div>
                                                <div className="text-xs text-muted-foreground">15+ Indices</div>
                                            </div>
                                            <div className="rounded-xl bg-primary/5 p-4 text-center">
                                                <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                                                <div className="text-sm font-semibold">99.9%</div>
                                                <div className="text-xs text-muted-foreground">Uptime SLA</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SlideInLeft>
                            <SlideInRight className="order-1 lg:order-2">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                    {about.title ?? 'Why Smart Investors Choose FX Paradox'}
                                </h2>
                                <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                                    {about.description ?? 'Founded by professional investors, FX Paradox bridges the gap between retail and institutional investing.'}
                                </p>
                                {(about.mission || about.vision) && (
                                    <div className="mt-8 space-y-4">
                                        {about.mission && (
                                            <div className="rounded-xl border bg-card p-4">
                                                <h4 className="text-sm font-semibold text-primary">Our Mission</h4>
                                                <p className="mt-1 text-sm text-muted-foreground">{about.mission}</p>
                                            </div>
                                        )}
                                        {about.vision && (
                                            <div className="rounded-xl border bg-card p-4">
                                                <h4 className="text-sm font-semibold text-primary">Our Vision</h4>
                                                <p className="mt-1 text-sm text-muted-foreground">{about.vision}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </SlideInRight>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <FadeIn>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                    {testimonials.title ?? 'Trusted by Professional Investors'}
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                                    {testimonials.description ?? 'See what our community has to say.'}
                                </p>
                            </div>
                        </FadeIn>
                        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
                            {testimonialsData.map((t, i) => (
                                <ScaleIn key={i} delay={i * 100}>
                                    <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg sm:p-8">
                                        <Quote className="mb-4 h-8 w-8 text-primary/30" />
                                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">&ldquo;{t.quote}&rdquo;</p>
                                        <div className="mt-6 flex items-center gap-3 border-t pt-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                {t.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">{t.name}</div>
                                                <div className="text-xs text-muted-foreground">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="border-y border-border/50 bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <FadeIn>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                {cta.title ?? 'Ready to Grow Your Wealth?'}
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                                {cta.description ?? 'Join thousands of investors already using FX Paradox.'}
                            </p>
                            <div className="mt-8">
                                <Link
                                    href={auth?.user ? '/dashboard' : (cta.button_link ?? '/register')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:text-base"
                                >
                                    {cta.button_text ?? 'Create Free Account'}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <FadeIn>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Get in Touch</h2>
                                <p className="mt-3 text-muted-foreground">Have questions? We&apos;d love to hear from you.</p>
                            </div>
                        </FadeIn>
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {[
                                { icon: Mail, label: 'Email', value: contact.email ?? 'support@fxparadox.com' },
                                { icon: Phone, label: 'Phone', value: contact.phone ?? '+1 (555) 123-4567' },
                                { icon: MapPin, label: 'Office', value: contact.address ?? 'New York, NY 10001' },
                            ].map((item, i) => (
                                <ScaleIn key={i} delay={i * 100}>
                                    <div className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center transition hover:shadow-lg">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-sm font-semibold">{item.label}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                                    </div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border/50 bg-card/50 py-8 sm:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold">FX Paradox</span>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {footer.description ?? 'Institutional-grade investment analytics and portfolio management for indices and stocks.'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Platform</h4>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <li><a href="#services" className="transition hover:text-foreground">Services</a></li>
                                    <li><a href="#about" className="transition hover:text-foreground">About Us</a></li>
                                    <li><a href="#testimonials" className="transition hover:text-foreground">Testimonials</a></li>
                                    <li><a href="#contact" className="transition hover:text-foreground">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Legal</h4>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <li><span>Privacy Policy</span></li>
                                    <li><span>Terms of Service</span></li>
                                    <li><span>Risk Disclosure</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Connect</h4>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <li><span>{contact.email ?? 'support@fxparadox.com'}</span></li>
                                    <li><span>{contact.phone ?? '+1 (555) 123-4567'}</span></li>
                                    <li><span>{contact.address ?? 'New York, NY 10001'}</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
                            <p className="text-xs text-muted-foreground">
                                {footer.copyright ?? `© ${new Date().getFullYear()} FX Paradox. All rights reserved.`}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={canInstall ? handleInstall : undefined}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    <Download className="h-4 w-4" />
                                    Get App
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
