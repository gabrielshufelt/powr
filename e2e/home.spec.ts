// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { test, expect } from '@playwright/test';

test('home page shows the powr heading', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'powr' })).toBeVisible();
});
