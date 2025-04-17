<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItems extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'order_id',
        'product_id',
        'unit_price',
    ];
}
