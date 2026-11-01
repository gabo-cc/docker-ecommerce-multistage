<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method_id' => [
                'required',
                'string',
                'starts_with:pm_',
                'max:255',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method_id.required' => 'El método de pago es obligatorio.',
            'payment_method_id.starts_with' => 'El método de pago proporcionado no es válido.',
        ];
    }
}
