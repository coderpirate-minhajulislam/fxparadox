export type NoteImage = {
    id: number;
    note_id: number;
    image_path: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

export type Note = {
    id: number;
    user_id: number;
    title: string;
    content: string | null;
    images: NoteImage[];
    created_at: string;
    updated_at: string;
};
