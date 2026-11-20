const BACKEND_URL = 'http://localhost:3003'

const resetAndCreateUser = async (request, { username, name, password }) => {
  await request.post(`${BACKEND_URL}/api/testing/reset`)
  const response = await request.post(`${BACKEND_URL}/api/users`, {
    data: { username, name, password },
  })
  return response.json()
}

const createUser = async (request, { username, name, password }) => {
  const response = await request.post(`${BACKEND_URL}/api/users`, {
    data: { username, name, password },
  })
  return response.json()
}

const loginWith = async (page, username, password) => {
  await page.locator('input[name="Username"]').fill(username)
  await page.locator('input[name="Password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('write title here').fill(title)
  await page.getByPlaceholder('write author here').fill(author)
  await page.getByPlaceholder('write url here').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('.blog').filter({ hasText: `${title} ${author}` }).waitFor()
}

module.exports = {
  BACKEND_URL,
  resetAndCreateUser,
  createUser,
  loginWith,
  createBlog,
}