<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    /**
     * Registrar un nuevo cliente.
     */
    #[OA\Post(
        path: '/auth/register',
        operationId: 'register',
        summary: 'Registrar un cliente',
        description: 'Crea un usuario con rol customer y devuelve un token JWT.',
        tags: ['Autenticación'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: [
                    'name',
                    'email',
                    'password',
                    'password_confirmation',
                ],
                properties: [
                    new OA\Property(
                        property: 'name',
                        type: 'string',
                        example: 'Douglas Calderón'
                    ),
                    new OA\Property(
                        property: 'email',
                        type: 'string',
                        format: 'email',
                        example: 'douglas@example.com'
                    ),
                    new OA\Property(
                        property: 'password',
                        type: 'string',
                        format: 'password',
                        example: 'Password123*'
                    ),
                    new OA\Property(
                        property: 'password_confirmation',
                        type: 'string',
                        format: 'password',
                        example: 'Password123*'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Usuario registrado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/TokenResponse'
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
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        $token = auth('api')->login($user);

        return $this->respondWithToken(
            $token,
            'Usuario registrado correctamente',
            201
        );
    }

    /**
     * Iniciar sesión y generar un token.
     */
    #[OA\Post(
        path: '/auth/login',
        operationId: 'login',
        summary: 'Iniciar sesión',
        description: 'Valida las credenciales y devuelve un token JWT.',
        tags: ['Autenticación'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(
                        property: 'email',
                        type: 'string',
                        format: 'email',
                        example: 'cliente@ecommerce.com'
                    ),
                    new OA\Property(
                        property: 'password',
                        type: 'string',
                        format: 'password',
                        example: 'Cliente123*'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Inicio de sesión correcto',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/TokenResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Credenciales incorrectas',
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
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
            ], 401);
        }

        return $this->respondWithToken(
            $token,
            'Inicio de sesión correcto'
        );
    }

    /**
     * Obtener los datos del usuario autenticado.
     */
    #[OA\Get(
        path: '/auth/me',
        operationId: 'me',
        summary: 'Consultar el usuario autenticado',
        tags: ['Autenticación'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Datos del usuario autenticado',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'user',
                            ref: '#/components/schemas/User'
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
        ]
    )]
    public function me(): JsonResponse
    {
        return response()->json([
            'user' => auth('api')->user(),
        ]);
    }

    /**
     * Cerrar sesión e invalidar el token.
     */
    #[OA\Post(
        path: '/auth/logout',
        operationId: 'logout',
        summary: 'Cerrar sesión',
        description: 'Invalida el token JWT actual.',
        tags: ['Autenticación'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Sesión cerrada correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
        ]
    )]
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Sesión cerrada correctamente',
        ]);
    }

    /**
     * Renovar el token JWT.
     */
    #[OA\Post(
        path: '/auth/refresh',
        operationId: 'refresh',
        summary: 'Renovar el token JWT',
        tags: ['Autenticación'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Token renovado correctamente',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/TokenResponse'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token ausente, inválido o vencido',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/MessageResponse'
                )
            ),
        ]
    )]
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(
            auth('api')->refresh(),
            'Token renovado correctamente'
        );
    }

    /**
     * Construir la respuesta que contiene el token.
     */
    private function respondWithToken(
        string $token,
        string $message,
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ], $status);
    }
}
