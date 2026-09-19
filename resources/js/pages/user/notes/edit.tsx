import { Head } from '@inertiajs/react';
import NoteForm from '@/components/note-form';
import type { Note } from '@/types/note';

type Props = {
    note: Note;
};

export default function EditNote({ note }: Props) {
    return (
        <>
            <Head title="Edit Note" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <NoteForm submitUrl={`/user/notes/${note.id}`} note={note} />
            </div>
        </>
    );
}

EditNote.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Notes', href: '/user/notes' },
        { title: 'Edit Note', href: '#' },
    ],
};
