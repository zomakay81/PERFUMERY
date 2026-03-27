import asyncio
from playwright.async_api import async_playwright
import os

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        try:
            # Connect to the dev server
            print("Connecting to http://localhost:5173...")
            await page.goto("http://localhost:5173", wait_until="networkidle")

            # 1. Test "Carico Rapido"
            print("Testing 'Carico Rapido'...")
            # Click Magazzino tab - use a more specific selector
            await page.click("aside button:has-text('Magazzino')")
            await page.wait_for_timeout(1000)

            # Click Carico Rapido button
            await page.click("button:has-text('CARICO RAPIDO')")

            # Wait for modal title
            print("Waiting for Stock-In Modal...")
            await page.wait_for_selector("h3:has-text('Carico Stock Rapido')", timeout=10000)

            # Click Nuovo Prodotto inside modal
            await page.click("button:has-text('NUOVO PRODOTTO')")

            # Fill new product form
            print("Filling new product form...")
            await page.fill("input[placeholder='SKU']", "TEST-SKU-001")
            await page.fill("input[placeholder='Nome']", "Prodotto Test Automatizzato")
            await page.click("button:has-text('Crea Anagrafica')")

            await page.screenshot(path="verify_stock_in.png")
            print("Stock-In verification screenshot saved.")

            # Close modal
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(500)

            # 2. Test Documents
            print("Testing 'Documenti'...")
            await page.click("aside button:has-text('Documenti')")
            await page.wait_for_timeout(1000)
            await page.click("button:has-text('NUOVO DOCUMENTO')")

            print("Waiting for Document Modal...")
            await page.wait_for_selector("h3:has-text('Nuovo Preventivo')", timeout=10000)

            # Change type to Fattura
            await page.select_option("select", label="Fattura")

            await page.screenshot(path="verify_doc_modal.png")
            print("Document modal verification screenshot saved.")

            print("Verification successful!")

        except Exception as e:
            print(f"Verification failed: {e}")
            await page.screenshot(path="error_screenshot.png")
            # Log the page content to see what's actually there
            content = await page.content()
            with open("error_page_content.html", "w") as f:
                f.write(content)
            raise e
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_verification())
