import { test, expect } from '@playwright/test';

test('renders UI and runs mock analysis', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: 'Analyze Brand' }).click();
  await expect(page.getByText('Analysis complete.')).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'One-click Brand Kit' }).click();
  await expect(page.getByText('Brand Kit applied.')).toBeVisible();
});

