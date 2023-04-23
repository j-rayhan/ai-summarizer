import * as React from 'react'
import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../redux/services/article';

interface Article {
  url: string,
  summary: string,
}
function Demo() {
  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();
  const [articles, setArticles] = React.useState<Article[] | []>([]);
    const [article, setArticle] = React.useState<Article>({
    url: '',
    summary: '',
  });
  React.useEffect(() => {
    const localStorArticle = localStorage.getItem('article');
    if (localStorArticle) {
      setArticles(JSON.parse(localStorArticle))
    }
  },[])
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const {data} = await getSummary({articleUrl: article.url});
      console.log("🚀 ~ file: Demo.tsx:15 ~ handleSubmit ~ data:", data)
      if (data?.summary){
        const newArticle = {
          ...article,
          summary: data.summary
        }
        setArticle(newArticle);
        setArticles(prevState => ([newArticle, ...prevState]))
        localStorage.setItem('article', JSON.stringify([newArticle, ...articles]))
      }
      console.log('PRINT IN %s=====>', 'submit START ***', article.url);
    } catch (err) {
      console.log("🚀 ~ file: Demo.tsx:13 ~ err:", err)
    }
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
            onChange={(e) => setArticle(prevValue => ({...prevValue, url: e.target.value}))}
          />
          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
          >
            🪄
          </button>
        </form>
      {/* Browse URL History */}
      </div> 
      {/* Display Results */}
    </section>
  )
}

export default Demo
