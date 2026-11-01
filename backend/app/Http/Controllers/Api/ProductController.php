<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[OA\Get(
        path: '/products',
        operationId: 'listProducts',
        summary: 'Listar productos disponibles',
        description: 'Devuelve productos activos, con existencias y paginados de diez en diez.',
        tags: ['Productos'],
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
                description: 'Listado paginado de productos',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                ref: '#/components/schemas/Product'
                            )
                        ),
                        new OA\Property(
                            property: 'links',
                            type: 'object'
                        ),
                        new OA\Property(
                            property: 'meta',
                            type: 'object'
                        ),
                    ]
                )
            ),
        ]
    )]
    public function index(): AnonymousResourceCollection
    {
        $products = Product::available()
            ->latest()
            ->paginate(10);

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    #[OA\Post(
        path: '/products',
        operationId: 'storeProduct',
        summary: 'Crear un producto',
        description: 'Crea un producto nuevo. Disponible únicamente para administradores.',
        tags: ['Productos'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                ref: '#/components/schemas/StoreProduct'
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Producto creado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ProductResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
            new OA\Response(
                response: 403,
                description: 'El usuario no es administrador',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Error de validación',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ValidationError'
                )
            ),
        ]
    )]
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return response()->json([
            'message' => 'Producto creado correctamente',
            'data' => new ProductResource($product),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    #[OA\Get(
        path: '/products/{product}',
        operationId: 'showProduct',
        summary: 'Consultar un producto',
        tags: ['Productos'],
        parameters: [
            new OA\Parameter(
                name: 'product',
                in: 'path',
                required: true,
                description: 'Identificador del producto',
                schema: new OA\Schema(
                    type: 'integer',
                    example: 3
                )
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Producto encontrado',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            ref: '#/components/schemas/Product'
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Producto no encontrado',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
        ]
    )]
    public function show(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     */
    #[OA\Put(
        path: '/products/{product}',
        operationId: 'replaceProduct',
        summary: 'Actualizar un producto mediante PUT',
        description: 'Actualiza los campos enviados. Disponible únicamente para administradores.',
        tags: ['Productos'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'product',
                in: 'path',
                required: true,
                description: 'Identificador del producto',
                schema: new OA\Schema(type: 'integer', example: 3)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                ref: '#/components/schemas/UpdateProduct'
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Producto actualizado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ProductResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
            new OA\Response(
                response: 403,
                description: 'El usuario no es administrador'
            ),
            new OA\Response(
                response: 404,
                description: 'Producto no encontrado'
            ),
            new OA\Response(
                response: 422,
                description: 'Error de validación',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ValidationError'
                )
            ),
        ]
    )]
    #[OA\Patch(
        path: '/products/{product}',
        operationId: 'updateProduct',
        summary: 'Actualizar parcialmente un producto',
        description: 'Actualiza únicamente los campos enviados. Disponible para administradores.',
        tags: ['Productos'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'product',
                in: 'path',
                required: true,
                description: 'Identificador del producto',
                schema: new OA\Schema(type: 'integer', example: 3)
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                ref: '#/components/schemas/UpdateProduct'
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Producto actualizado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ProductResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
            new OA\Response(
                response: 403,
                description: 'El usuario no es administrador'
            ),
            new OA\Response(
                response: 404,
                description: 'Producto no encontrado'
            ),
            new OA\Response(
                response: 422,
                description: 'Error de validación',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/ValidationError'
                )
            ),
        ]
    )]
    public function update(
        UpdateProductRequest $request,
        Product $product
    ): JsonResponse {
        $product->update($request->validated());

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'data' => new ProductResource($product->refresh()),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    #[OA\Delete(
        path: '/products/{product}',
        operationId: 'deleteProduct',
        summary: 'Eliminar un producto',
        description: 'Elimina lógicamente un producto. Disponible únicamente para administradores.',
        tags: ['Productos'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'product',
                in: 'path',
                required: true,
                description: 'Identificador del producto',
                schema: new OA\Schema(type: 'integer', example: 3)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Producto eliminado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido'
            ),
            new OA\Response(
                response: 403,
                description: 'El usuario no es administrador'
            ),
            new OA\Response(
                response: 404,
                description: 'Producto no encontrado'
            ),
        ]
    )]
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente',
        ]);
    }
}
