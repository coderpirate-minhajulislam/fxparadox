import { Head } from '@inertiajs/react';
import NoteForm from '@/components/note-form';

export default function CreateNote() {
    return (
        <>
            <Head title="New Note" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <NoteForm submitUrl="/user/notes" />
            </div>
        </>
    );
}

CreateNote.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Notes', href: '/user/notes' },
        { title: 'New Note', href: '/user/notes/create' },
    ],
};
