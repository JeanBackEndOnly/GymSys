<?php

namespace App\Services;

use App\Models\ProductPaycheck;
use App\Models\ProductSold;
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
            // Create receipt header
            $paycheck = ProductPaycheck::create([
                'sold_by' => $data['sold_by'],
                'paid_by' => $data['paid_by'] ?? null,
                'paid_by_name' => $data['paid_by_name'] ?? null,
                'payment_type' => $data['payment_type'],
                'or_number' => $data['or_number'],
                'transaction_id' => $data['transaction_id'] ?? null,
                'payment_status' => $data['payment_status'] ?? 'paid',
            ]);

            // Handle products (single or multiple)
            $items = [];
            
            if (isset($data['product_id'])) {
                // Single product format
                $items = [
                    [
                        'product_id' => $data['product_id'],
                        'quantity' => $data['quantity'],
                        'price_at_sale' => $data['unit_price'] ?? $data['price_at_sale'],
                    ]
                ];
            } elseif (isset($data['products'])) {
                // Multiple products format
                $items = $data['products'];
            } else {
                throw new \Exception('No products provided.');
            }

            // Create each item in product_sold table
            foreach ($items as $item) {
                $this->createProductSoldItem($paycheck->id, $item);
                $this->updateProductInventory($item['product_id'], $item['quantity']);
            }

            DB::commit();
            
            // Load items with their product details for response
            $paycheck->load('items.product');
            
            return $paycheck;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create paycheck: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create a single product sold item
     */
    private function createProductSoldItem(int $paycheckId, array $itemData): void
    {
        ProductSold::create([
            'paycheck_id' => $paycheckId,
            'product_id' => $itemData['product_id'],
            'quantity' => $itemData['quantity'],
            'price_at_sale' => $itemData['price_at_sale'],
        ]);
    }

    /**
     * Update product inventory (decrease quantity, increase sold count)
     */
    public function updateProductInventory(int $productId, int $quantity): void
    {
        $product = Products::findOrFail($productId);
        $product->decrement('quantity', $quantity);
        $product->increment('sold', $quantity);
    }

    /**
     * Validate that a user exists and is active
     */
    public function validateActiveUser(int $userId): void
    {
        $user = User::where('id', $userId)
                    ->where('status', 'active')
                    ->exists();

        if (!$user) {
            throw new \Exception("User ID {$userId} is not active or does not exist.");
        }
    }

    /**
     * Get all paychecks with their items and products
     */
    public function getAllPaychecks()
    {
        return ProductPaycheck::with('items.product')->get();
    }

    /**
     * Get a single paycheck with its items and products
     */
    public function getPaycheckById(int $id)
    {
        return ProductPaycheck::with('items.product')->find($id);
    }

    /**
     * Delete a paycheck and restore product inventory
     */
    public function deletePaycheck(int $paycheckId): bool
    {
        $paycheck = ProductPaycheck::with('items.product')->findOrFail($paycheckId);

        DB::beginTransaction();

        try {
            // Restore inventory for each product sold
            foreach ($paycheck->items as $item) {
                $product = $item->product;
                $product->increment('quantity', $item->quantity);
                $product->decrement('sold', $item->quantity);
            }

            // Delete the paycheck (cascade will delete product_sold records if set)
            $deleted = $paycheck->delete();
            
            DB::commit();
            return $deleted;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete paycheck: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get total revenue from all paychecks
     */
    public function getTotalRevenue(): float
    {
        $items = ProductSold::with('paycheck')
            ->whereHas('paycheck', function ($query) {
                $query->where('payment_status', 'paid');
            })
            ->get();
        
        $total = 0;
        foreach ($items as $item) {
            $total += $item->quantity * $item->price_at_sale;
        }
        
        return $total;
    }
}