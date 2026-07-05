import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    /*
     * Tests if the Home page correctly renders essential visual elements including
     * the main title heading and the greeting text.
     */
    test('displays essential content', async ({ page }) => {
        await expect(page).toHaveTitle(/Peter Fan/);
        await expect(page.getByRole('heading', { name: 'Peter Fan' })).toBeVisible();
        await expect(page.getByText('Hello!')).toBeVisible();
    });

    /*
     * Tests the functionality of all main navigation links in the navbar
     * to ensure they correctly route the user to their respective pages.
     */
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

    /*
     * Tests the primary Call-To-Action (CTA) button on the Home page
     * to ensure it successfully navigates the user to the Chatbot project page.
     */
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

    /*
     * Tests if the About page correctly displays all main informational sections
     * such as the heading, profile image, education, and interests.
     */
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

    /*
     * Tests if the Projects page correctly renders the main heading and
     * the list of projects, verifying at least one specific project text exists.
     */
    test('displays project list', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
        await expect(page.getByText('LLM Agent Chatbot')).toBeVisible();
    });

    /*
     * Tests project navigation by clicking a specific project CTA from the list
     * and verifying that it successfully routes to that specific project page.
     */
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

    /*
     * Tests if the Experience page correctly renders the main heading
     * associated with the user's work history timeline.
     */
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

    /*
     * Tests if the Contact page correctly displays essential contact information
     * including the main heading and external presence links like LinkedIn.
     */
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
        /*
         * Tests the complete end-to-end typing and response flow for the chatbot
         * using actual production APIs for a specific selected model.
         */
        test(`can chat using ${model.value} model (Real API)`, async ({ page }) => {
            await page.goto('/projects/chatbot_v2');

            // Select Model
            await page.getByRole('combobox').selectOption(model.value);
            // Verify URL update (uses Next.js router.push for client-side navigation)
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

    /*
     * Tests the persistence of the chatbot conversation history by sending a message,
     * navigating away from the page, and then returning to verify the message remains.
     */
    test('persists conversation history across navigation', async ({ page }) => {
        // Clear localStorage first to ensure clean state
        await page.goto('/projects/chatbot_v2');
        await page.evaluate(() => {
            localStorage.removeItem('chatbot_v2_messages_gemini');
            localStorage.removeItem('chatbot_v2_uuid_gemini');
        });
        await page.reload();
        await page.waitForTimeout(500);

        // Send a message
        const testMessage = 'Persistence test message';
        await page.getByPlaceholder('Type your message...').fill(testMessage);
        await page.getByRole('button', { name: 'Send' }).click();
        await expect(page.getByText(testMessage)).toBeVisible();

        // Wait for AI response
        const responseLocator = page.locator('.bg-gray-100').nth(1);
        await expect(responseLocator).toBeVisible({ timeout: 45000 });

        // Navigate away
        await page.goto('/projects');
        await expect(page).toHaveURL(/.*projects$/);

        // Navigate back
        await page.goto('/projects/chatbot_v2');
        await page.waitForTimeout(500);

        // Verify message is still there (use exact match to avoid matching AI response that may echo the message)
        await expect(page.locator('.bg-blue-100').getByText(testMessage, { exact: true })).toBeVisible();
    });

    /*
     * Tests the "Reset Conversation" functionality by sending a message and
     * asserting that clicking reset successfully clears out the message history.
     */
    test('reset button clears conversation', async ({ page }) => {
        await page.goto('/projects/chatbot_v2');
        await page.evaluate(() => {
            localStorage.removeItem('chatbot_v2_messages_gemini');
            localStorage.removeItem('chatbot_v2_uuid_gemini');
        });
        await page.reload();
        await page.waitForTimeout(500);

        // Send a message
        const testMessage = 'Hello';
        await page.getByPlaceholder('Type your message...').fill(testMessage);
        await page.getByRole('button', { name: 'Send' }).click();
        await expect(page.getByText(testMessage)).toBeVisible();

        // Wait for AI response to start and then fully finish streaming
        const responseLocator = page.locator('.bg-gray-100').nth(1);
        await expect(responseLocator).toBeVisible({ timeout: 45000 });
        await expect(page.getByText('Chat Agent is thinking...')).not.toBeVisible({ timeout: 45000 });

        // Click reset button
        await page.getByRole('button', { name: 'Reset Conversation' }).click();
        await page.waitForTimeout(500);

        // Verify message is gone and only initial greeting remains
        await expect(page.getByText(testMessage)).not.toBeVisible();
        await expect(page.getByText("Hi! I am Peter's AI chatbot")).toBeVisible();

        // Verify only one message bubble (the initial greeting)
        const messageBubbles = page.locator('.bg-gray-100, .bg-blue-100');
        await expect(messageBubbles).toHaveCount(1);
    });

    /*
     * Tests the isolated persistence of conversation history for different embedding models
     * ensuring that history does not leak or override when switching models.
     */
    test('persists separate histories for each embedding model', async ({ page }) => {
        // Clear localStorage for both models
        await page.goto('/projects/chatbot_v2');
        await page.evaluate(() => {
            localStorage.removeItem('chatbot_v2_messages_gemini');
            localStorage.removeItem('chatbot_v2_uuid_gemini');
            localStorage.removeItem('chatbot_v2_messages_openai');
            localStorage.removeItem('chatbot_v2_uuid_openai');
        });
        await page.reload();
        await page.waitForTimeout(500);

        // Send message with Gemini (default)
        const geminiMessage = 'Gemini specific message';
        await page.getByPlaceholder('Type your message...').fill(geminiMessage);
        await page.getByRole('button', { name: 'Send' }).click();

        // Verify user message is visible (in blue bubble)
        await expect(page.locator('.bg-blue-100').getByText(geminiMessage, { exact: true })).toBeVisible();

        // Wait for response
        await expect(page.locator('.bg-gray-100').nth(1)).toBeVisible({ timeout: 45000 });

        // Switch to OpenAI - uses client-side navigation via Next.js router
        await page.getByRole('combobox').selectOption('openai');
        await expect(page).toHaveURL(/.*embedding=openai/);
        await page.waitForTimeout(1000);

        // Verify Gemini message is NOT visible (different model history)
        await expect(page.locator('.bg-blue-100').getByText(geminiMessage, { exact: true })).not.toBeVisible();

        // Send message with OpenAI
        const openaiMessage = 'OpenAI specific message';
        await page.getByPlaceholder('Type your message...').fill(openaiMessage);
        await page.getByRole('button', { name: 'Send' }).click();

        // Verify user message is visible (in blue bubble)
        await expect(page.locator('.bg-blue-100').getByText(openaiMessage, { exact: true })).toBeVisible();

        // Wait for response
        await expect(page.locator('.bg-gray-100').nth(1)).toBeVisible({ timeout: 45000 });

        // Switch back to Gemini
        await page.getByRole('combobox').selectOption('gemini');
        await expect(page).toHaveURL(/.*embedding=gemini/);
        await page.waitForTimeout(1000);

        // Verify Gemini message is back (in blue bubble) and OpenAI message is not visible
        await expect(page.locator('.bg-blue-100').getByText(geminiMessage, { exact: true })).toBeVisible();
        await expect(page.locator('.bg-blue-100').getByText(openaiMessage, { exact: true })).not.toBeVisible();
    });
});

