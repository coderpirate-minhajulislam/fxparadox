<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplerImage extends Model
{
    protected $fillable = ['templer_id', 'image_path', 'sort_order'];

    public function templer(): BelongsTo
    {
        return $this->belongsTo(Templer::class);
    }
}
