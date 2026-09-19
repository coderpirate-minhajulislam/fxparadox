import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X } from 'lucide-react';
import type { Note, NoteImage } from '@/types/note';
import { useRef, useState, type FormEvent } from 'react';

type Props = {
    submitUrl: string;
    note?: Note;
};

export default function NoteForm({ submitUrl, note }: Props) {
    const isEditing = !!note;

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        content: string;
        images: File[];
        existing_image_ids: number[];
        remove_image_ids: number[];
        _method?: string;
    }>({
        title: note?.title || '',
        content: note?.content || '',
        images: [],
        existing_image_ids: note?.images?.map((img: NoteImage) => img.id) || [],
        remove_image_ids: [],
        ...(isEditing ? { _method: 'PUT' } : {}),
    });

    const [existingImages, setExistingImages] = useState<NoteImage[]>(
        note?.images || [],
    );
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const totalExisting = existingImages.length;
        const totalNew = newImagePreviews.length;
        const totalFiles = files.length;
        const remaining = 10 - totalExisting - totalNew;

        if (remaining <= 0) {
            alert('You can upload a maximum of 10 images per note.');
            return;
        }

        const filesToAdd = Array.from(files).slice(0, remaining);
        const newFiles = [...data.images, ...filesToAdd];
        setData('images', newFiles);

        const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
        setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (imageId: number) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setData('existing_image_ids', data.existing_image_ids.filter((id) => id !== imageId));
        setData('remove_image_ids', [...data.remove_image_ids, imageId]);
    };

    const removeNewImage = (index: number) => {
        const newFiles = data.images.filter((_, i) => i !== index);
        setData('images', newFiles);
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(submitUrl, { forceFormData: true });
    };

    const totalImages = existingImages.length + newImagePreviews.length;

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Note' : 'New Note'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Market Analysis Notes"
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={8}
                            placeholder="Write your note content here..."
                        />
                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Images (max 10)</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <div className="flex flex-wrap gap-3">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative h-32 w-32">
                                    <img
                                        src={`/${img.image_path}`}
                                        alt="Note image"
                                        className="h-32 w-32 rounded-lg border object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.id)}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}

                            {newImagePreviews.map((preview, index) => (
                                <div key={index} className="relative h-32 w-32">
                                    <img
                                        src={preview}
                                        alt="New image preview"
                                        className="h-32 w-32 rounded-lg border object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}

                            {totalImages < 10 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
                                >
                                    <ImagePlus className="h-8 w-8" />
                                    <span className="text-xs">Add Image</span>
                                </button>
                            )}
                        </div>

                        {(errors.images || errors.existing_image_ids) && (
                            <p className="text-sm text-red-500">{errors.images || errors.existing_image_ids}</p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEditing ? 'Update Note' : 'Create Note'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
