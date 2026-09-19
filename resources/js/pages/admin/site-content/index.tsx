import { Head, router } from '@inertiajs/react';
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import type { SiteContentGrouped, SiteContentItem } from '@/types/site-content';

const sectionLabels: Record<string, string> = {
    settings: 'Site Settings',
    hero: 'Hero Section',
    stats: 'Statistics Bar',
    services: 'Services Section',
    about: 'About Section',
    testimonials: 'Testimonials Section',
    cta: 'Call to Action',
    contact: 'Contact Information',
    footer: 'Footer',
};

const keyLabels: Record<string, string> = {
    site_name: 'Site Name',
    site_logo: 'Site Logo',
    site_favicon: 'Favicon',
    title: 'Title',
    subtitle: 'Subtitle',
    description: 'Description',
    button_text: 'Button Text',
    button_link: 'Button Link',
    image: 'Image',
    icon: 'Icon Name',
    copyright: 'Copyright Text',
    stat_1_value: 'Stat 1 Value',
    stat_1_label: 'Stat 1 Label',
    stat_2_value: 'Stat 2 Value',
    stat_2_label: 'Stat 2 Label',
    stat_3_value: 'Stat 3 Value',
    stat_3_label: 'Stat 3 Label',
    stat_4_value: 'Stat 4 Value',
    stat_4_label: 'Stat 4 Label',
    service_1_icon: 'Service 1 Icon',
    service_1_title: 'Service 1 Title',
    service_1_description: 'Service 1 Description',
    service_2_icon: 'Service 2 Icon',
    service_2_title: 'Service 2 Title',
    service_2_description: 'Service 2 Description',
    service_3_icon: 'Service 3 Icon',
    service_3_title: 'Service 3 Title',
    service_3_description: 'Service 3 Description',
    service_4_icon: 'Service 4 Icon',
    service_4_title: 'Service 4 Title',
    service_4_description: 'Service 4 Description',
    mission: 'Mission Statement',
    vision: 'Vision Statement',
    testimonial_1_name: 'Testimonial 1 Name',
    testimonial_1_role: 'Testimonial 1 Role',
    testimonial_1_quote: 'Testimonial 1 Quote',
    testimonial_2_name: 'Testimonial 2 Name',
    testimonial_2_role: 'Testimonial 2 Role',
    testimonial_2_quote: 'Testimonial 2 Quote',
    testimonial_3_name: 'Testimonial 3 Name',
    testimonial_3_role: 'Testimonial 3 Role',
    testimonial_3_quote: 'Testimonial 3 Quote',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Office Address',
};

const sectionOrder = ['hero', 'stats', 'services', 'about', 'testimonials', 'cta', 'contact', 'footer', 'settings'];

export default function SiteContentIndex({ contents }: { contents: SiteContentGrouped }) {
    const [values, setValues] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        Object.values(contents).flat().forEach((item) => {
            initial[item.id] = item.value ?? '';
        });
        return initial;
    });
    const [files, setFiles] = useState<Record<number, File>>({});
    const [previews, setPreviews] = useState<Record<number, string>>({});
    const [processing, setProcessing] = useState(false);
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    const handleValueChange = (id: number, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (id: number, file: File | null) => {
        if (file) {
            setFiles((prev) => ({ ...prev, [id]: file }));
            setPreviews((prev) => ({ ...prev, [id]: URL.createObjectURL(file) }));
        }
    };

    const removeImage = (id: number) => {
        setFiles((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setPreviews((prev) => {
            const next = { ...prev };
            if (next[id]) {
                URL.revokeObjectURL(next[id]);
                delete next[id];
            }
            return next;
        });
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id]!.value = '';
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        const allItems = Object.values(contents).flat();

        allItems.forEach((item, index) => {
            formData.append(`items[${index}][id]`, String(item.id));
            formData.append(`items[${index}][value]`, values[item.id] ?? '');
        });

        Object.entries(files).forEach(([id, file]) => {
            formData.append(`files[${id}]`, file);
        });

        router.post('/admin/site-content', formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    const getImageSrc = (item: SiteContentItem): string | null => {
        if (previews[item.id]) return previews[item.id];
        if (item.value) return `/storage/${item.value}`;
        return null;
    };

    const sortedSections = sectionOrder.filter((s) => contents[s]);
    const extraSections = Object.keys(contents).filter((s) => !sectionOrder.includes(s));
    const allSections = [...sortedSections, ...extraSections];

    return (
        <>
            <Head title="Edit Home Page" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Home Page</h2>
                    <p className="text-muted-foreground">Manage all content, images, and information on the public home page.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {allSections.map((section) => (
                        <div key={section} className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h3 className="mb-4 text-lg font-semibold">{sectionLabels[section] ?? section}</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {contents[section].map((item) => (
                                    <div key={item.id} className={item.type === 'textarea' ? 'md:col-span-2' : ''}>
                                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                                            {keyLabels[item.key] ?? item.key}
                                        </label>

                                        {item.type === 'text' || item.type === 'icon' ? (
                                            <input
                                                type="text"
                                                value={values[item.id] ?? ''}
                                                onChange={(e) => handleValueChange(item.id, e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        ) : item.type === 'textarea' ? (
                                            <textarea
                                                value={values[item.id] ?? ''}
                                                onChange={(e) => handleValueChange(item.id, e.target.value)}
                                                rows={3}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        ) : item.type === 'image' ? (
                                            <div className="space-y-2">
                                                {getImageSrc(item) ? (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={getImageSrc(item)!}
                                                            alt={item.key}
                                                            className="h-32 w-auto rounded-md border object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(item.id)}
                                                            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => fileInputRefs.current[item.id]?.click()}
                                                        className="flex h-32 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary/50"
                                                    >
                                                        <div className="text-center">
                                                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/50" />
                                                            <p className="mt-1 text-xs text-muted-foreground">Click to upload</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <input
                                                    ref={(el) => { fileInputRefs.current[item.id] = el; }}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(item.id, e.target.files?.[0] ?? null)}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRefs.current[item.id]?.click()}
                                                    className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                                                >
                                                    <Upload className="h-3 w-3" />
                                                    {getImageSrc(item) ? 'Replace' : 'Upload'}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
