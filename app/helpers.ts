import axios, { AxiosInstance } from 'axios'

let getHeaders
let getRequestURL

if (typeof window === 'undefined') {
  // Server-side
  import('vinxi/http').then((module) => {
    getHeaders = module.getHeaders
    getRequestURL = module.getRequestURL
  })
}

export const axiosInstance = (): AxiosInstance => {
  if (typeof window === 'undefined') {
    // Server-side
    if (!getHeaders || !getRequestURL) {
      throw new Error('Server-side imports not loaded yet')
    }

    const url = new URL(getRequestURL())
    const baseUrl = `${url.protocol}//${url.host}`

    return axios.create({
      baseURL: baseUrl,
      headers: getHeaders(),
    })
  } else {
    // Client-side
    return axios.create()
  }
}

export const fakeApiLoadTime = async () => {
  // Fake load time demonstration purposes
  return await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

export const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
