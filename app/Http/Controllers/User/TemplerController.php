<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Templer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplerController extends Controller
{
    public function index(Request $request)
    {
        $templers = $request->user()->templers()->with('images')->latest()->get();

        return Inertia::render('user/templers/index', [
            'templers' => $templers,
        ]);
    }

    public function create()
    {
        return Inertia::render('user/templers/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'strategy_note' => ['nullable', 'string', 'max:5000'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $imagesData = $validated['images'] ?? [];
        unset($validated['images']);

        $templer = Templer::create($validated);

        if (!empty($imagesData)) {
            foreach ($imagesData as $index => $file) {
                $filename = time() . '_templer_' . $index . '_' . $file->hashName();
                $file->move(public_path('uploads/templers'), $filename);
                $templer->images()->create([
                    'image_path' => 'uploads/templers/' . $filename,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('user.templers.index')
            ->with('success', 'Template created successfully.');
    }

    public function show(Templer $templer)
    {
        if ($templer->user_id !== auth()->id()) {
            abort(403);
        }

        $templer->load('images');

        return Inertia::render('user/templers/show', [
            'templer' => $templer,
        ]);
    }

    public function edit(Templer $templer)
    {
        if ($templer->user_id !== auth()->id()) {
            abort(403);
        }

        $templer->load('images');

        return Inertia::render('user/templers/edit', [
            'templer' => $templer,
        ]);
    }

    public function update(Request $request, Templer $templer)
    {
        if ($templer->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'strategy_note' => ['nullable', 'string', 'max:5000'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
            'existing_image_ids' => ['nullable', 'array'],
            'existing_image_ids.*' => ['integer', 'exists:templer_images,id'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer', 'exists:templer_images,id'],
        ]);

        $templer->update([
            'title' => $validated['title'],
            'strategy_note' => $validated['strategy_note'] ?? null,
        ]);

        // Remove images that were deleted by the user
        if (!empty($validated['remove_image_ids'])) {
            $imagesToRemove = $templer->images()->whereIn('id', $validated['remove_image_ids'])->get();
            foreach ($imagesToRemove as $img) {
                if (file_exists(public_path($img->image_path))) {
                    unlink(public_path($img->image_path));
                }
                $img->delete();
            }
        }

        // Add new uploaded images
        if (!empty($validated['images'])) {
            $maxOrder = $templer->images()->max('sort_order') ?? -1;
            foreach ($validated['images'] as $index => $file) {
                $filename = time() . '_templer_' . $index . '_' . $file->hashName();
                $file->move(public_path('uploads/templers'), $filename);
                $templer->images()->create([
                    'image_path' => 'uploads/templers/' . $filename,
                    'sort_order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return redirect()->route('user.templers.index')
            ->with('success', 'Template updated successfully.');
    }

    public function destroy(Templer $templer)
    {
        if ($templer->user_id !== auth()->id()) {
            abort(403);
        }

        foreach ($templer->images as $image) {
            if (file_exists(public_path($image->image_path))) {
                unlink(public_path($image->image_path));
            }
        }

        $templer->delete();

        return redirect()->route('user.templers.index')
            ->with('success', 'Template deleted successfully.');
    }
}
