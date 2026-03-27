import asyncio
from playwright.async_api import async_playwright

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:5173")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="01_dashboard.png")

        # Click Magazzino
        await page.click("text=Magazzino")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="02_magazzino.png")

        # Click Carico Rapido
        await page.click("text=CARICO RAPIDO")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="03_stock_in_modal.png")

        # Click Documenti
        await page.click("text=Documenti")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="04_documenti.png")

        # Click Nuovo Documento
        await page.click("text=NUOVO DOCUMENTO")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="05_document_modal.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_verification())
