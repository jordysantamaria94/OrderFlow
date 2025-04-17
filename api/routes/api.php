<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\OrdersController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/orders', [OrdersController::class, 'index']);
    Route::get('/order/detail/{id}', [OrdersController::class, 'detail']);
    Route::post('/order/create', [OrdersController::class, 'create']);
    Route::put('/order/update/{id}', [OrdersController::class, 'update']);
    Route::delete('/order/delete/{id}', [OrdersController::class, 'delete']);

    Route::get('/clients', [OrdersController::class, 'clients']);
    Route::get('/products', [OrdersController::class, 'products']);
});