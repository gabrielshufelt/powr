// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { test, expect } from '@playwright/test';

test('signed-out visitors to the home page are sent to the login page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
