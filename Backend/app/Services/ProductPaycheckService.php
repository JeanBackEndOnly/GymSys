<?php

namespace App\Services;

use App\Models\ProductPaycheck;
use App\Models\Products;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductPaycheckService
{
    public function createPaycheck(array $data): ProductPaycheck
    {
        // Validate users are active
        $this->validateActiveUser($data['sold_by']);
        
        if (!empty($data['paid_by'])) {
            $this->validateActiveUser($data['paid_by']);
        }

        DB::beginTransaction();

        try {
            // Create receipt header (NO product columns here!)
            $paycheck = ProductPaycheck::create([
                'sold_by' => $data['sold_by'],
                'paid_by' => $data['paid_by'] ?? null,
                'paid_by_name' => $data['paid_by_name'] ?? null,
                'payment_type' => $data['payment_type'],
                'or_number' => $data['or_number'],
                'transaction_id' => $data['transaction_id'] ?? null,
                'payment_status' => $data['payment_status'] ?? 'paid',
            ]);

            // Handle products (always use pivot table, even for single product)
            $products = [];
            
            // Check if single product or multiple products
            if (isset($data['product_id'])) {
                // Convert single product to array format
                $products = [
                    [
                        'product_id' => $data['product_id'],
                        'quantity' => $data['quantity'],
                        'price_at_sale' => $data['unit_price'] ?? $data['price_at_sale'],
                    ]
                ];
            } elseif (isset($data['products'])) {
                // Multiple products
                $products = $data['products'];
            } else {
                throw new \Exception('No products provided.');
            }

            // Attach all products to pivot table
            foreach ($products as $productData) {
                $this->attachProductToPaycheck($paycheck, $productData);
                $this->updateProductInventory($productData['product_id'], $productData['quantity']);
            }

            DB::commit();
            
            // Load relationship for response
            $paycheck->load('products');
            
            return $paycheck;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create paycheck: ' . $e->getMessage());
            throw $e;
        }
    }

    private function attachProductToPaycheck(ProductPaycheck $paycheck, array $productData): void
    {
        $paycheck->products()->attach($productData['product_id'], [
            'quantity' => $productData['quantity'],
            'price_at_sale' => $productData['price_at_sale'],
        ]);
    }

    public function updateProductInventory(int $productId, int $quantity): void
    {
        $product = Products::findOrFail($productId);
        $product->decrement('quantity', $quantity);
        $product->increment('sold', $quantity);
    }

    public function validateActiveUser(int $userId): void
    {
        $user = User::where('id', $userId)
                    ->where('status', 'active')
                    ->exists();

        if (!$user) {
            throw new \Exception("User ID {$userId} is not active or does not exist.");
        }
    }

    public function getAllPaychecks()
    {
        return ProductPaycheck::with('products')->get();
    }

    public function deletePaycheck(int $paycheckId): bool
    {
        $paycheck = ProductPaycheck::with('products')->findOrFail($paycheckId);

        DB::beginTransaction();

        try {
            // Restore inventory for each product
            foreach ($paycheck->products as $product) {
                $product->increment('quantity', $product->pivot->quantity);
                $product->decrement('sold', $product->pivot->quantity);
            }

            // Delete the paycheck (cascade will delete pivot records)
            $deleted = $paycheck->delete();
            DB::commit();
            return $deleted;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete paycheck: ' . $e->getMessage());
            throw $e;
        }
    }
}