from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to the IELTS module homepage
    page.goto("http://localhost:3000/ielts")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/ielts_home.png")

    # Navigate to Session Tracker
    page.goto("http://localhost:3000/ielts/session")
    page.wait_for_timeout(1000)

    # Fill in a couple of answers
    inputs = page.locator("input[type='text']")
    inputs.nth(0).fill("True")
    page.wait_for_timeout(500)
    inputs.nth(1).fill("False")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/ielts_session.png")

    # Navigate to Review and Analysis
    page.goto("http://localhost:3000/ielts/review")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/ielts_review.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 720}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
