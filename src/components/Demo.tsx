import * as React from 'react'
import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../redux/services/article';

interface Article {
  url: string,
  summary: string,
}
function Demo() {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [articles, setArticles] = React.useState<Article[] | []>([]);
  const [article, setArticle] = React.useState<Article>({
    url: '',
    summary: '',
  });
  const [copied, setCopied] = React.useState<string>('');
  React.useEffect(() => {
    const localStorArticle = localStorage.getItem('article');
    if (localStorArticle) {
      setArticles(JSON.parse(localStorArticle))
    }
  }, [])
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isExist = articles.find(({url}) => article.url === url);
      if (isExist) {
        const newArticle = {
          ...article,
          summary: isExist.summary
        }
        setArticle(newArticle);
        return
      }
      const { data } = await getSummary({ articleUrl: article.url });
      if (data?.summary) {
        const newArticle = {
          ...article,
          summary: data.summary
        }
        setArticle(newArticle);
        setArticles(prevState => ([newArticle, ...prevState]))
        localStorage.setItem('article', JSON.stringify([newArticle, ...articles]))
      }
    } catch (err) {
      console.log("🚀 ~ file: Demo.tsx:13 ~ err:", err)
    }
  }
  const handleCopy = (url: string) => {
    setCopied(url);
    navigator.clipboard.writeText(url);
    setTimeout(() => setCopied(''), 700);
  }
  return (
    <section className='w-full max-w-xl mt-16'>
      {/* Search */}
      <div className='flex w-full flex-col gap-2'>
        <form className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='link_icon'
            className='absolute left-0 my-0 ml-3 w-5'
          />
          <input
            type='url'
            placeholder='enter an url'
            className='url_input peer'
            required
            value={article.url}
            onChange={(e) => setArticle(prevValue => ({ ...prevValue, url: e.target.value }))}
          />
          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
          >
            🪄
          </button>
        </form>
        {/* Browse URL History */}
        <div
          className='flex flex-col gap-1 max-h-60 overflow-y-auto'
        >
          {
            articles.map((item, index) => (
              <div
                key={`link-${index}`}
                onClick={() => setArticle(item)}
                className='link_card'
              >
                <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                  <img src={copied === item.url ? tick : copy} alt="copy_icon" className='w-[40%] h-[40%] object-contain' />
                </div>
                <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                  {item.url}
                </p>
              </div>
            ))
          }
        </div>
      </div>
      {/* Display Results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt="loader_icon" className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn't supposed to happen....
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary ? (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article
                <span className='blue_gradient ml-1'>Summary</span>
              </h2>
              <div className='summary_box'>
              <p className='font-inter font-medium text-sm text-gray-700'>
                {article.summary}
              </p>
              </div>
            </div>
          ) : null
        )}
      </div>
    </section>
  )
}

export default Demo
