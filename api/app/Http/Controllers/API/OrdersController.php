<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orders;
use App\Models\Clients;
use App\Models\OrderItems;
use App\Models\Products;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class OrdersController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = \DB::table('orders')
        ->join('order_items', 'order_items.order_id', '=', 'orders.id')
        ->join('products', 'products.id', '=', 'order_items.product_id')
        ->join('clients', 'clients.id', '=', 'orders.client_id')
        ->where('orders.user_id', Auth::id())
        ->whereNull('orders.deleted_at')
        ->select('orders.id as order_id', 'orders.total_amount', 'clients.name as client_name', 'clients.email as client_email', 'clients.phone as client_phone', 'products.*')
        ->get()
        ->groupBy('order_id')
        ->map(function ($orderItems) {
            return [
                'client' => $orderItems->first(),
                'products' => $orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'price' => $item->price,
                    ];
                })->toArray(),
            ];
        })
        ->values()
        ->toArray();

        return response()->json($orders);
    }

    public function clients(Request $request): JsonResponse
    {
        $clients = Clients::all();

        return response()->json($clients);
    }
    
    public function products(Request $request): JsonResponse
    {
        $products = Products::all();

        return response()->json($products);
    }

    public function detail($id, Request $request): JsonResponse
    {
        $order = Orders::find($id);
        $orderItems = OrderItems::where('order_id', $id)->get();

        foreach ($orderItems as $key => $orderItem) {
            $product = Products::find($orderItem->product_id)->select('id as product_id')->first();
            $orderItems[$key]->product = $product;
        }

        return response()->json([
            'order' => $order,
            'items' => $orderItems
        ]);
    }

    public function create(Request $request): JsonResponse
    {
        $order = Orders::create([
            'user_id' => Auth::id(),
            'client_id' => $request->clientId,
            'total_amount' => $request->totalAmount
        ]);

        foreach ($request->products as $product) {
            OrderItems::create([
                'order_id' => $order->id,
                'product_id' => $product['id'],
                'unit_price' => $product['price']
            ]);
        }

        return response()->json([
            "flag" => true,
            "orden" => $order,
            "message" => "Orden creada exitosamente"
        ], 201);
    }

    public function update($id, Request $request): JsonResponse
    {
        $order = Orders::find($id);

        $order->client_id = $request->clientId;
        $order->total_amount = $request->totalAmount;
        $order->save();

        foreach ($request->products as $product) {

            $orderItems = OrderItems::where('order_id', $id)->where('product_id', $product["id"])->first();
            
            if ($product["isChecked"]) {

                if (!$orderItems) {
                    OrderItems::create([
                        'order_id' => $order->id,
                        'product_id' => $product['id'],
                        'unit_price' => $product['price']
                    ]);
                }
             } else {
                if ($orderItems) {
                    $orderItems->delete();
                }
             }
        }

        return response()->json([
            "flag" => true,
            "message" => "Orden actualizada exitosamente"
        ], 200);
    }

    public function delete($id, Request $request): JsonResponse
    {
        $order = Orders::find($id);
        $order->delete();

        return response()->json([
            "flag" => true,
            "message" => "Orden eliminada exitosamente"
        ], 200);
    }
}
