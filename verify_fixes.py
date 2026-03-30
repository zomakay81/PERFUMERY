import asyncio
from playwright.async_api import async_playwright

async def verify_fixes():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('http://localhost:3000')
        await page.wait_for_load_state('networkidle')

        # 1. Verify Convert Quote to Invoice
        print("Testing Quote to Invoice conversion...")
        await page.click('button:has-text("Documenti")')
        await page.wait_for_timeout(1000)

        # Count documents before
        count_before = await page.locator('tr').count()

        # Find Preventivo row and click convert to invoice
        quote_row = page.locator('tr:has-text("Preventivo")').first
        await quote_row.hover()
        await quote_row.locator('button[title="Converti in Fattura"]').click()
        await page.wait_for_timeout(1000)

        # Count documents after
        count_after = await page.locator('tr').count()
        if count_after > count_before:
            print("SUCCESS: New document generated.")
        else:
            print("FAILURE: No new document generated.")

        # Verify status of quote
        quote_status = await quote_row.locator('span >> nth=-1').text_content()
        print(f"Quote status after conversion: {quote_status.strip()}")

        # 2. Verify Order Cancellation -> Quote Restore
        print("\nTesting Order cancellation status restoration...")
        # Reload to have fresh state if needed, but let's just find another quote if available
        # or use Undo to restore the quote from "Convertito"
        await page.click('button:has-text("Annulla")') # Undo the conversion
        await page.wait_for_timeout(1000)

        # Create an order from a quote first
        await quote_row.hover()
        await quote_row.locator('button[title="Converti in Ordine"]').click()
        await page.wait_for_timeout(500)

        # Go to Ordini
        await page.click('button:has-text("Ordini")')
        await page.wait_for_timeout(1000)
        order_row = page.locator('tr').nth(1) # Assuming new order is near top
        await order_row.hover()
        await order_row.locator('button[title="Modifica"]').click()
        await page.wait_for_timeout(500)

        # Set to Annullato
        await page.select_option('select:has-text("Nuovo")', 'Annullato')
        await page.click('button:has-text("Salva Modifiche")')
        await page.wait_for_timeout(1000)

        # Check Quote status back in Documenti
        await page.click('button:has-text("Documenti")')
        await page.wait_for_timeout(1000)
        quote_status_final = await quote_row.locator('span >> nth=-1').text_content()
        print(f"Quote status after order cancellation: {quote_status_final.strip()}")

        # 3. Verify Movimenti Detail View Stability
        print("\nTesting Movimenti Detail View stability...")
        await page.click('button:has-text("Movimenti")')
        await page.wait_for_timeout(1000)

        # Open first movement detail
        await page.locator('tr').nth(1).hover()
        await page.locator('button >> .lucide-arrow-right').first.click()
        await page.wait_for_timeout(1000)

        if await page.locator('h3:has-text("Fattura")').is_visible() or await page.locator('h3:has-text("DDT")').is_visible():
            print("SUCCESS: Document Detail Modal opened without crash.")
        else:
            print("FAILURE: Document Detail Modal not visible.")

        await page.screenshot(path='/home/jules/verification/final_fixes_check.png', full_page=True)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_fixes())
