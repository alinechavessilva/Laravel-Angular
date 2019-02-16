<?php

namespace App\Models\Task;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id');
    }
}
