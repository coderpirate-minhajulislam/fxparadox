import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { Note } from '@/types/note';
import { useState } from 'react';

type Props = {
    notes: Note[];
};

export default function NotesIndex({ notes = [] }: Props) {
    return (
        <>
            <Head title="Notes" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Notes</h1>
                    <Link href="/user/notes/create">
                        <Button size="sm">
                            <Plus className="mr-1 h-4 w-4" />
                            New Note
                        </Button>
                    </Link>
                </div>

                {notes.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No notes yet. Click "New Note" to create your first note.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function NoteCard({ note }: { note: Note }) {
    const [zoom, setZoom] = useState(1);
    const firstImage = note.images?.[0];

    return (
        <Card className="overflow-hidden">
            {firstImage && (
                <Dialog>
                    <DialogTrigger asChild>
                        <button type="button" className="w-full cursor-pointer overflow-hidden">
                            <img
                                src={`/${firstImage.image_path}`}
                                alt={note.title}
                                className="h-48 w-full object-cover transition-transform hover:scale-105"
                            />
                        </button>
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined} className="!fixed !inset-2 !translate-x-0 !translate-y-0 !top-2 !left-2 !w-[calc(100vw-1rem)] !h-[calc(100vh-1rem)] !max-w-none !max-h-none !rounded-lg !border-none !p-4 !gap-2">
                        <DialogTitle className="sr-only">{note.title}</DialogTitle>
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
                                src={`/${firstImage.image_path}`}
                                alt={note.title}
                                className="transition-transform duration-200"
                                style={{ transform: `scale(${zoom})` }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{note.title}</CardTitle>
                {note.images && note.images.length > 1 && (
                    <p className="text-xs text-muted-foreground">{note.images.length} images</p>
                )}
            </CardHeader>
            <CardContent>
                {note.content && (
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                        {note.content}
                    </p>
                )}
                <div className="flex items-center gap-1">
                    <Link href={`/user/notes/${note.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/user/notes/${note.id}/edit`}>
                        <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{note.title}"? This action cannot be undone and all associated images will be permanently removed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.delete(`/user/notes/${note.id}`)}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}

NotesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Notes', href: '/user/notes' },
    ],
};
