const { test, expect, beforeEach, describe } = require('@playwright/test')
const {
  resetAndCreateUser,
  loginWith,
  createBlog,
} = require('./helper')

const primaryUser = {
  username: 'raytester',
  name: 'Ray Tester',
  password: 'password123',
}

describe('Blog app (routed)', () => {
  beforeEach(async ({ page, request }) => {
    await resetAndCreateUser(request, primaryUser)
    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with the correct username/password combination', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, primaryUser.username, primaryUser.password)

      await expect(page.getByText(`${primaryUser.name} logged-in`)).toBeVisible()
      await expect(page).toHaveURL(/\/$/)
    })

    test('fails if the username/password is incorrect', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, primaryUser.username, 'wrongpassword')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText(`${primaryUser.name} logged-in`)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, primaryUser.username, primaryUser.password)
      await expect(page.getByText(`${primaryUser.name} logged-in`)).toBeVisible()
    })

    test('a logged-in user can create a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'create blog' }).click()
      await createBlog(page, {
        title: 'Playwright E2E Testing Guide',
        author: 'Ray-Junior Mongwe',
        url: 'https://playwright.dev',
      })

      await expect(page).toHaveURL(/\/$/)
      await expect(page.locator('.blog').filter({ hasText: 'Playwright E2E Testing Guide Ray-Junior Mongwe' })).toBeVisible()
    })

    test('a logged-in user can like blogs', async ({ page }) => {
      await page.getByRole('link', { name: 'create blog' }).click()
      await createBlog(page, {
        title: 'Likable Blog Post',
        author: 'Author One',
        url: 'https://example.com/like',
      })

      await page.getByRole('link', { name: /Likable Blog Post/ }).click()
      await expect(page).toHaveURL(/\/blogs\/.+/)

      const likesLocator = page.locator('.blog-likes')
      await expect(likesLocator).toHaveText('0')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(likesLocator).toHaveText('1')
    })

    test('a logged-in user can delete a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'create blog' }).click()
      await createBlog(page, {
        title: 'Deletable Blog Post',
        author: 'Author Two',
        url: 'https://example.com/delete',
      })

      await page.getByRole('link', { name: /Deletable Blog Post/ }).click()

      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page).toHaveURL(/\/$/)
      await expect(page.getByText('Deletable Blog Post')).not.toBeVisible()
    })
  })
})