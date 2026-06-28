import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads and displays key content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CUSHLABS/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("AI That Works While You Sleep")).toBeVisible();
    await expect(page.getByText("See What We Build")).toBeVisible();
  });

  test("homepage CTA navigates to portfolio", async ({ page }) => {
    await page.goto("/");
    await page.getByText("See What We Build").click();
    await expect(page).toHaveURL(/\/portfolio/);
  });

  test("portfolio page loads with project cards", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveTitle(/Portfolio.*CUSHLABS/i);
    // Portfolio cards link to /en/portfolio/<slug> or /portfolio/<slug>
    const cards = page.locator('a[href*="/portfolio/"]');
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("portfolio category filter is present", async ({ page }) => {
    await page.goto("/portfolio");
    // Wait for the DOM to render. Avoid 'networkidle' — the cards' fallback OG
    // images (opengraph.githubassets.com) can rate-limit/hang and never settle.
    await page.waitForLoadState("domcontentloaded");
    // Filter controls — could be tabs, buttons, or select
    const filters = page
      .getByRole("tablist")
      .or(page.getByRole("combobox"))
      .or(page.locator('[role="tab"]'));
    await expect(filters.first()).toBeVisible({ timeout: 15_000 });
  });

  test("portfolio detail page loads for a project", async ({ page }) => {
    await page.goto("/portfolio");
    const projectLink = page.locator('a[href*="/portfolio/"]').first();
    await expect(projectLink).toBeVisible({ timeout: 15_000 });
    await projectLink.click();
    // URL should have a slug after /portfolio/
    await expect(page).toHaveURL(/\/portfolio\/[^/]+/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("featured page loads", async ({ page }) => {
    await page.goto("/featured");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("Spanish locale works", async ({ page }) => {
    await page.goto("/es");
    await expect(
      page.getByText("IA Que Trabaja Mientras Duermes"),
    ).toBeVisible();
  });

  test("no critical console errors on key pages", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.goto("/portfolio");
    await page.waitForLoadState("domcontentloaded");

    // Filter out known benign errors (404s for missing images, dev warnings)
    const critical = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("DevTools") &&
        !e.includes("hydration") &&
        !e.includes("Failed to load resource") &&
        !e.includes("404"),
    );
    expect(critical).toHaveLength(0);
  });

  test("security headers are present", async ({ page }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();
    const headers = response!.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
