<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoteImage extends Model
{
    protected $fillable = ['note_id', 'image_path', 'sort_order'];

    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
}
