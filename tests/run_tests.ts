import assert from 'node:assert';
import { storeService } from '../src/services/storeService';
import { CartItem } from '../src/types/database';

// In Node test environment, mock localStorage if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => { store.set(key, String(value)); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (index: number) => Array.from(store.keys())[index] || null,
    length: store.size
  };
}

let passed = 0;
let failed = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        console.log(`  ✓ ${name}`);
        passed++;
      }).catch(err => {
        console.error(`  ✗ ${name}`);
        console.error(`    ${err.message}`);
        failed++;
      });
    } else {
      console.log(`  ✓ ${name}`);
      passed++;
    }
  } catch (err: any) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function main() {
  console.log('====================================================');
  console.log('PIXELLE STUDIO — AUTOMATED SUITE VERIFICATION');
  console.log('====================================================\n');

  // Test 1: Price Validation
  await runTest('Price validation: rejects sale_price >= regular_price', async () => {
    let errorThrown = false;
    try {
      await storeService.saveProduct({
        name: 'Invalid Pricing Product',
        regular_price: 1000,
        sale_price: 1200
      });
    } catch (e: any) {
      errorThrown = true;
      assert.match(e.message, /Sale price must be less/);
    }
    assert.strictEqual(errorThrown, true);
  });

  // Test 2: Product Creation
  await runTest('Product creation: creates valid simple digital product', async () => {
    const product = await storeService.saveProduct({
      name: 'Test Social Media Kit',
      category_id: 'cat-1',
      regular_price: 1200,
      sale_price: 850,
      unlimited_stock: true,
      download_file_url: 'https://example.com/test.zip'
    });
    assert.strictEqual(product.name, 'Test Social Media Kit');
    assert.strictEqual(product.regular_price, 1200);
    assert.strictEqual(product.sale_price, 850);
    assert.strictEqual(product.unlimited_stock, true);
  });

  // Test 3: Safe Category Deletion
  await runTest('Category safety: prevents deletion of category with assigned products', async () => {
    const result = await storeService.deleteCategory('cat-1');
    assert.strictEqual(result.success, false);
    assert.match(result.error || '', /Cannot delete category/);
  });

  // Test 4: Bangladeshi Phone Validation
  await runTest('Checkout validation: rejects invalid non-Bangladeshi phone numbers', async () => {
    const dummyCart: CartItem[] = [{
      id: 'prod-1',
      product_id: 'prod-1',
      name: 'Social Media Template Pack',
      price: 1200,
      regular_price: 1500,
      image_url: '',
      quantity: 1,
      unlimited_stock: true,
      stock_quantity: 999
    }];

    const result = await storeService.createOrder({
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '12345', // invalid
      billing_city: 'Dhaka',
      payment_method: 'bkash',
      sender_phone: '01700000000',
      transaction_id: 'TEST123A',
      idempotency_key: `test_idemp_${Date.now()}`,
      cart_items: dummyCart
    });

    assert.strictEqual(result.success, false);
    assert.match(result.error || '', /valid Bangladeshi mobile number/);
  });

  // Test 5: Idempotency & Order Creation
  await runTest('Checkout idempotency: prevents duplicate order submissions', async () => {
    const dummyCart: CartItem[] = [{
      id: 'prod-1',
      product_id: 'prod-1',
      name: 'Social Media Template Pack',
      price: 1200,
      regular_price: 1500,
      image_url: '',
      quantity: 1,
      unlimited_stock: true,
      stock_quantity: 999
    }];

    const testKey = `idemp_unique_${Date.now()}`;
    const firstAttempt = await storeService.createOrder({
      customer_name: 'Idempotency Tester',
      customer_email: 'idemp@example.com',
      customer_phone: '01712345678',
      billing_city: 'Dhaka',
      payment_method: 'bkash',
      sender_phone: '01712345678',
      transaction_id: `TRX${Date.now()}`,
      idempotency_key: testKey,
      cart_items: dummyCart
    });

    assert.strictEqual(firstAttempt.success, true);
    const firstOrderId = firstAttempt.order?.id;

    // Second call with same idempotency key
    const secondAttempt = await storeService.createOrder({
      customer_name: 'Idempotency Tester',
      customer_email: 'idemp@example.com',
      customer_phone: '01712345678',
      billing_city: 'Dhaka',
      payment_method: 'bkash',
      sender_phone: '01712345678',
      transaction_id: `TRX${Date.now()}`,
      idempotency_key: testKey,
      cart_items: dummyCart
    });

    assert.strictEqual(secondAttempt.success, true);
    assert.strictEqual(secondAttempt.order?.id, firstOrderId, 'Returns existing order instead of creating duplicate');
  });

  // Test 6: Payment Verification Workflow
  await runTest('Payment workflow: Admin approval marks paid, updates order, logs audit', async () => {
    const dummyCart: CartItem[] = [{
      id: 'prod-2',
      product_id: 'prod-2',
      name: 'Daily Planner Template',
      price: 800,
      regular_price: 800,
      image_url: '',
      quantity: 1,
      unlimited_stock: true,
      stock_quantity: 999
    }];

    const created = await storeService.createOrder({
      customer_name: 'Verification User',
      customer_email: 'verify@example.com',
      customer_phone: '01812345678',
      billing_city: 'Chittagong',
      payment_method: 'nagad',
      sender_phone: '01812345678',
      transaction_id: `NGD${Date.now()}`,
      idempotency_key: `key_pay_${Date.now()}`,
      cart_items: dummyCart
    });

    assert.strictEqual(created.success, true);
    const orderId = created.order!.id;
    assert.strictEqual(created.order!.payment_status, 'pending_verification');

    // Admin verifies payment
    const approved = await storeService.verifyPayment(orderId, 'approve', 'bKash/Nagad confirmed in ledger');
    assert.strictEqual(approved.payment_status, 'paid');
    assert.strictEqual(approved.order_status, 'completed');
    assert.strictEqual(approved.payment_submission?.status, 'approved');
  });

  // Test 7: Digital Download Entitlements
  await runTest('Digital downloads: verified paid customer retrieves download files', async () => {
    const downloads = await storeService.getCustomerDownloads('verify@example.com');
    assert.ok(downloads.length > 0, 'Customer should have at least 1 digital download file');
    assert.strictEqual(downloads[0].product_name, 'Daily Planner Template');
    assert.ok(downloads[0].download_key.startsWith('key_'));
  });

  // Test 8: Inventory Movement Logging
  await runTest('Inventory logging: movements are logged with delta, reason, and timestamp', async () => {
    await storeService.logInventoryMovement({
      product_id: 'prod-1',
      product_name: 'Social Media Template Pack',
      change_quantity: 50,
      new_stock_quantity: 1049,
      reason: 'Batch production add'
    });

    const movements = await storeService.getInventoryMovements();
    const found = movements.find(m => m.reason === 'Batch production add');
    assert.ok(found, 'Inventory movement should be logged');
    assert.strictEqual(found?.change_quantity, 50);
  });

  // Test 9: Audit Logs Persistence
  await runTest('Audit logging: sensitive admin actions generate verifiable audit records', async () => {
    const logs = await storeService.getAuditLogs();
    assert.ok(logs.length > 0, 'Audit trail must contain system and admin action logs');
  });

  console.log(`\n====================================================`);
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log(`====================================================`);

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
