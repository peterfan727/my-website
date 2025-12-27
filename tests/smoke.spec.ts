import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('displays essential content', async ({ page }) => {
        await expect(page).toHaveTitle(/Peter Fan/);
        await expect(page.getByRole('heading', { name: 'Peter Fan' })).toBeVisible();
        await expect(page.getByText('Hello!')).toBeVisible();
    });

    test('navigates through navbar links', async ({ page }) => {
        // Links to check: About, Projects, Experience, Contact
        const links = ['About', 'Projects', 'Experience', 'Contact'];

        for (const link of links) {
            // Re-navigate home to reset state
            await page.goto('/');
            await page.getByRole('link', { name: link }).first().click();
            await expect(page).toHaveURL(new RegExp(`.*${link.toLowerCase()}`));
        }
    });

    test('primary CTA navigates to Chatbot', async ({ page }) => {
        await page.goto('/'); // Ensure we start at home
        // Use a more specific selector if possible or force click
        await page.getByRole('link', { name: 'Talk to My Chatbot' }).first().click();
        await expect(page).toHaveURL(/.*projects\/chatbot_v2/);
    });
});

test.describe('About Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/about');
    });

    test('displays detailed information', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
        await expect(page.getByRole('img', { name: 'Peter Fan' })).toBeVisible();
        await expect(page.getByText('Education Background')).toBeVisible();
        await expect(page.getByText('Areas of Interest')).toBeVisible();
    });
});

test.describe('Projects Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/projects');
    });

    test('displays project list', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
        await expect(page.getByText('LLM Agent Chatbot')).toBeVisible();
    });

    test('navigates to specific project', async ({ page }) => {
        // Click the "Talk to My Chatbot" text which is inside the Link
        await page.getByText('Talk to My Chatbot').first().click();
        await expect(page).toHaveURL(/.*projects\/chatbot_v2/);
    });
});

test.describe('Experience Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/experience');
    });

    test('displays work history', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Work Experience' })).toBeVisible();
        // Check for at least one timeline item or position if logic allows
        // Since timelines are rendered dynamically, checking for main container or known static text
    });
});

test.describe('Contact Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/contact');
    });

    test('displays contact info', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Contact Me' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    });
});

test.describe('Chatbot V2', () => {

    const models = [
        { value: 'gemini', id: 'gemini' },
        { value: 'openai', id: 'openai' }
    ];

    for (const model of models) {
        test(`can chat using ${model.value} model (Real API)`, async ({ page }) => {
            await page.goto('/projects/chatbot_v2');

            // Select Model
            await page.getByRole('combobox').selectOption(model.value);
            // Verify URL update (wait for reload logic if any, though React logic uses window.location which causes reload)
            await expect(page).toHaveURL(new RegExp(`embedding=${model.value}`));

            // Verify UI State
            await expect(page.getByPlaceholder('Type your message...')).toBeVisible();

            // Wait for any useEffect state resets to settle after model change
            await page.waitForTimeout(1000);

            // Send Message
            const message = `Hello ${model.value} test`;
            await page.getByPlaceholder('Type your message...').fill(message);
            await expect(page.getByRole('button', { name: 'Send' })).toBeEnabled();
            await page.getByRole('button', { name: 'Send' }).click();

            // Verify User Message
            await expect(page.getByText(message)).toBeVisible();

            // Verify AI Response
            // The first message is the intro. The second bubble with 'bg-gray-100' class should be the response.
            // Using a relaxed selector to finding valid response content
            const responseLocator = page.locator('.bg-gray-100').nth(1);
            await expect(responseLocator).toBeVisible({ timeout: 45000 }); // Increase timeout for real API

            const responseText = await responseLocator.textContent();
            expect(responseText?.length).toBeGreaterThan(0);
            expect(responseText).not.toContain('error');
        });
    }
});

