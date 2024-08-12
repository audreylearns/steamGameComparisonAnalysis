import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css' 
import Layout from '@/components/Layout'
import { SWRConfig } from 'swr';

const fetcher = async (...args) => {
  const response = await fetch(...args)
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await response.json()
    error.status = response.status
    throw error
  }
  // console.log(response.json)
  return response.json()

}

export default function App({ Component, pageProps }) {
  return (
    <>
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </>
  )
}