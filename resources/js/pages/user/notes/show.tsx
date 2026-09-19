import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Pencil, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { Note } from '@/types/note';
import { useState } from 'react';

type Props = {
    note: Note;
};

export default function ShowNote({ note }: Props) {
    const [zoom, setZoom] = useState(1);

    return (
        <>
            <Head title={note.title} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Link href="/user/notes">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <Link href={`/user/notes/${note.id}/edit`}>
                        <Button size="sm">
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{note.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Created {new Date(note.created_at).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {note.content && (
                            <div className="space-y-1">
                                <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                            </div>
                        )}

                        {note.images && note.images.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Images</h3>
                                <div className="flex flex-wrap gap-3">
                                    {note.images.map((image) => (
                                        <Dialog key={image.id}>
                                            <DialogTrigger asChild>
                                                <button type="button" className="cursor-pointer overflow-hidden rounded-lg">
                                                    <img
                                                        src={`/${image.image_path}`}
                                                        alt={`Note image ${image.sort_order + 1}`}
                                                        className="h-32 w-32 rounded-lg object-cover"
                                                    />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent aria-describedby={undefined} className="!fixed !inset-2 !translate-x-0 !translate-y-0 !top-2 !left-2 !w-[calc(100vw-1rem)] !h-[calc(100vh-1rem)] !max-w-none !max-h-none !rounded-lg !border-none !p-4 !gap-2">
                                                <DialogTitle className="sr-only">Note image</DialogTitle>
                                                <div className="flex items-center gap-2 pr-8">
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}>
                                                        <ZoomIn className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}>
                                                        <ZoomOut className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(1)}>
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex-1 overflow-auto flex items-center justify-center">
                                                    <img
                                                        src={`/${image.image_path}`}
                                                        alt={`Note image ${image.sort_order + 1}`}
                                                        className="transition-transform duration-200"
                                                        style={{ transform: `scale(${zoom})` }}
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ShowNote.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Notes', href: '/user/notes' },
        { title: 'View Note', href: '#' },
    ],
};
