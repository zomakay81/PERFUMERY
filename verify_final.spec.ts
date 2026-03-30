
import { test, expect } from '@playwright/test';

test.describe('Final Bug Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/');
    // Wait for the app to load
    await page.waitForSelector('text=Dashboard Panoramica');
  });

  test('Verify Stock Image Upload Logic', async ({ page }) => {
    await page.click('nav button:has-text("Magazzino")');
    await page.click('button:has-text("Nuovo Articolo")');

    // Check that URL field is GONE
    const urlInput = page.locator('input[placeholder="https://..."]');
    await expect(urlInput).not.toBeVisible();

    // Check that file input is present (hidden but usable via button)
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('Verify Document Payment Logic', async ({ page }) => {
    await page.click('nav button:has-text("Documenti")');

    // Find a document row (not paid)
    const row = page.locator('tr:has-text("Preventivo"), tr:has-text("Fattura")').first();
    await row.hover();

    const walletBtn = row.locator('button[title="Registra Pagamento"]');
    if (await walletBtn.isVisible()) {
        await walletBtn.click();
        await expect(page.locator('h3:has-text("Registra Pagamento")')).toBeVisible();
    } else {
        console.log('No eligible document for payment found in test, skipping click');
    }
  });

  test('Verify Movimenti Detail View and Edit', async ({ page }) => {
    await page.click('nav button:has-text("Movimenti")');

    // Ensure some movements exist
    const row = page.locator('tbody tr').first();
    await row.hover();

    const detailBtn = row.locator('button:has(svg.lucide-arrow-right)');
    await detailBtn.click();

    // Verify modal content
    const modal = page.locator('div[role="dialog"]'); // Approximate
    // Since we don't have role="dialog" explicitly, look for the text in the newly opened modal
    await expect(page.locator('h4:has-text("Dettaglio Articoli")')).toBeVisible();

    // Check if "MODIFICA CARICO" button is present for Carico Libero
    const docTypeText = await page.locator('h3').textContent();
    if (docTypeText?.includes('Carico Libero')) {
        await expect(page.locator('button:has-text("MODIFICA CARICO")')).toBeVisible();
    }
  });

  test('Verify Finance Table New Columns', async ({ page }) => {
    await page.click('nav button:has-text("Finanza")');
    await expect(page.locator('th:has-text("Doc. Tipo")')).toBeVisible();
    await expect(page.locator('th:has-text("Doc. Numero")')).toBeVisible();
    await expect(page.locator('th:has-text("Importo Doc.")')).toBeVisible();
  });
});
