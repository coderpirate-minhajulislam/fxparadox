<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\NoteImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = $request->user()->notes()->with('images')->latest()->get();

        return Inertia::render('user/notes/index', [
            'notes' => $notes,
        ]);
    }

    public function create()
    {
        return Inertia::render('user/notes/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:10000'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $imagesData = $validated['images'] ?? [];
        unset($validated['images']);

        $note = Note::create($validated);

        if (!empty($imagesData)) {
            foreach ($imagesData as $index => $file) {
                $filename = time() . '_note_' . $index . '_' . $file->hashName();
                $file->move(public_path('uploads/notes'), $filename);
                $note->images()->create([
                    'image_path' => 'uploads/notes/' . $filename,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('user.notes.index')
            ->with('success', 'Note created successfully.');
    }

    public function show(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->load('images');

        return Inertia::render('user/notes/show', [
            'note' => $note,
        ]);
    }

    public function edit(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $note->load('images');

        return Inertia::render('user/notes/edit', [
            'note' => $note,
        ]);
    }

    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:10000'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
            'existing_image_ids' => ['nullable', 'array'],
            'existing_image_ids.*' => ['integer', 'exists:note_images,id'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer', 'exists:note_images,id'],
        ]);

        $note->update([
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
        ]);

        // Remove images that were deleted by the user
        if (!empty($validated['remove_image_ids'])) {
            $imagesToRemove = $note->images()->whereIn('id', $validated['remove_image_ids'])->get();
            foreach ($imagesToRemove as $img) {
                if (file_exists(public_path($img->image_path))) {
                    unlink(public_path($img->image_path));
                }
                $img->delete();
            }
        }

        // Add new uploaded images
        if (!empty($validated['images'])) {
            $maxOrder = $note->images()->max('sort_order') ?? -1;
            foreach ($validated['images'] as $index => $file) {
                $filename = time() . '_note_' . $index . '_' . $file->hashName();
                $file->move(public_path('uploads/notes'), $filename);
                $note->images()->create([
                    'image_path' => 'uploads/notes/' . $filename,
                    'sort_order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return redirect()->route('user.notes.index')
            ->with('success', 'Note updated successfully.');
    }

    public function destroy(Note $note)
    {
        if ($note->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete all images from disk
        foreach ($note->images as $image) {
            if (file_exists(public_path($image->image_path))) {
                unlink(public_path($image->image_path));
            }
        }

        $note->delete();

        return redirect()->route('user.notes.index')
            ->with('success', 'Note deleted successfully.');
    }
}
