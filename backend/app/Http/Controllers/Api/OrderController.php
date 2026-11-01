<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: '/orders',
        operationId: 'listOrders',
        summary: 'Listar órdenes',
        description: 'El cliente consulta sus órdenes y el administrador consulta todas.',
        tags: ['Órdenes'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'page',
                in: 'query',
                required: false,
                description: 'Número de página',
                schema: new OA\Schema(
                    type: 'integer',
                    minimum: 1,
                    example: 1
                )
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Listado paginado de órdenes',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                ref: '#/components/schemas/Order'
                            )
                        ),
                        new OA\Property(property: 'links', type: 'object'),
                        new OA\Property(property: 'meta', type: 'object'),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
        ]
    )]
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Order::with(['user', 'items.product'])
            ->latest();

        if (! $request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        return OrderResource::collection(
            $query->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: '/orders',
        operationId: 'storeOrder',
        summary: 'Crear una orden',
        description: 'Crea una orden, calcula el total y descuenta las existencias.',
        tags: ['Órdenes'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                ref: '#/components/schemas/StoreOrder'
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Orden creada correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/OrderResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
            new OA\Response(
                response: 422,
                description: 'Producto no disponible, existencias insuficientes o error de validación',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ValidationError'
                )
            ),
        ]
    )]
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = DB::transaction(function () use ($request) {
            $total = 0;
            $orderItems = [];

            foreach ($request->validated('items') as $index => $item) {
                $product = Product::query()
                    ->lockForUpdate()
                    ->findOrFail($item['product_id']);

                if (! $product->is_active) {
                    throw ValidationException::withMessages([
                        "items.$index.product_id" =>
                        'El producto seleccionado no está disponible.',
                    ]);
                }

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        "items.$index.quantity" =>
                        "Existencias insuficientes para {$product->name}. Disponibles: {$product->stock}.",
                    ]);
                }

                $unitPrice = (float) $product->price;
                $subtotal = round($unitPrice * $item['quantity'], 2);

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];

                $total += $subtotal;

                $product->decrement('stock', $item['quantity']);
            }

            $order = $request->user()->orders()->create([
                'total' => round($total, 2),
                'status' => 'pending',
                'currency' => 'USD',
            ]);

            $order->items()->createMany($orderItems);

            return $order;
        });

        $order->load(['user', 'items.product']);

        return response()->json([
            'message' => 'Orden creada correctamente',
            'data' => new OrderResource($order),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: '/orders/{order}',
        operationId: 'showOrder',
        summary: 'Consultar una orden',
        description: 'El propietario o un administrador pueden consultar la orden.',
        tags: ['Órdenes'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'order',
                in: 'path',
                required: true,
                description: 'Identificador de la orden',
                schema: new OA\Schema(type: 'integer', example: 3)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Orden encontrada',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            ref: '#/components/schemas/Order'
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
            new OA\Response(
                response: 403,
                description: 'El usuario no puede consultar esta orden'
            ),
            new OA\Response(
                response: 404,
                description: 'Orden no encontrada'
            ),
        ]
    )]
    public function show(Request $request, Order $order): OrderResource
    {
        if (
            ! $request->user()->isAdmin()
            && $order->user_id !== $request->user()->id
        ) {
            abort(403, 'No tienes permiso para consultar esta orden.');
        }

        $order->load(['user', 'items.product']);

        return new OrderResource($order);
    }
}
