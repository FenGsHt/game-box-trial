"use client"

import Link from 'next/link'
import { useTranslation } from 'react-i18next';

// 社交媒体图标组件
const TwitterIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
  </svg>
)

const InstagramIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
  </svg>
)

// 支付方式图标组件
const VisaIcon = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="24" rx="4" fill="#F9F9F9"/>
    <path d="M15.22 15.36H13.04L14.28 8.64H16.46L15.22 15.36Z" fill="#00579F"/>
    <path d="M22.48 8.82C22.04 8.64 21.32 8.46 20.44 8.46C18.44 8.46 17 9.54 16.98 11.04C16.96 12.16 17.98 12.78 18.76 13.16C19.56 13.54 19.8 13.78 19.8 14.1C19.8 14.6 19.2 14.84 18.64 14.84C17.88 14.84 17.48 14.72 16.84 14.42L16.6 14.3L16.34 16.12C16.86 16.36 17.8 16.58 18.78 16.58C20.9 16.58 22.32 15.52 22.34 13.9C22.36 13.02 21.8 12.34 20.58 11.78C19.84 11.42 19.4 11.16 19.4 10.78C19.4 10.42 19.82 10.06 20.66 10.06C21.36 10.04 21.88 10.22 22.28 10.4L22.46 10.48L22.72 8.72L22.48 8.82Z" fill="#00579F"/>
    <path d="M25.5 8.64H23.92C23.42 8.64 23.04 8.78 22.84 9.34L19.92 15.36H22.04L22.44 14.24H24.94L25.14 15.36H27.02L25.5 8.64ZM22.98 12.7C23.2 12.14 23.9 10.28 23.9 10.28C23.9 10.28 24.06 9.84 24.16 9.58L24.28 10.24C24.28 10.24 24.68 12.18 24.8 12.7H22.98Z" fill="#00579F"/>
    <path d="M12.14 8.64L10.18 13.16L9.98 12.14C9.64 10.9 8.54 9.56 7.32 8.94L9.06 15.36H11.2L14.3 8.64H12.14Z" fill="#00579F"/>
    <path d="M8.78 8.64H5.5L5.46 8.82C8.02 9.44 9.7 11.06 10.36 13.16L9.62 9.36C9.52 8.8 9.2 8.66 8.78 8.64Z" fill="#F9A533"/>
  </svg>
)

const MastercardIcon = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="24" rx="4" fill="#F9F9F9"/>
    <path d="M22.12 5.72H15.88V18.28H22.12V5.72Z" fill="#FF5A00"/>
    <path d="M16.32 12C16.32 9.48 17.52 7.24 19.38 5.72C17.86 4.48 15.9 3.72 13.78 3.72C8.98 3.72 5.08 7.4 5.08 12C5.08 16.6 8.98 20.28 13.78 20.28C15.9 20.28 17.86 19.52 19.38 18.28C17.52 16.76 16.32 14.52 16.32 12Z" fill="#EB001B"/>
    <path d="M32.92 12C32.92 16.6 29.02 20.28 24.22 20.28C22.1 20.28 20.14 19.52 18.62 18.28C20.48 16.76 21.68 14.52 21.68 12C21.68 9.48 20.48 7.24 18.62 5.72C20.14 4.48 22.1 3.72 24.22 3.72C29.02 3.72 32.92 7.4 32.92 12Z" fill="#F79E1B"/>
  </svg>
)

const AlipayIcon = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="24" rx="4" fill="#F9F9F9"/>
    <path d="M30.14 15.6C28.22 13.96 25.82 12.28 25.82 12.28L25.46 12.48C25.46 12.48 25.94 13.04 26.26 13.84C26.58 14.64 25.78 15.4 24.82 15.4H10.34C10.34 15.4 12.06 8.92 17.38 8.92C20.78 8.92 23.7 11.08 23.7 11.08C23.7 11.08 24.74 8.08 24.78 7.6C24.82 7.12 24.5 6.96 23.82 6.96C23.14 6.96 19.78 6.96 17.78 6.96C11.62 6.96 7.86 12.96 7.86 17.04C7.86 19.56 9.66 20.4 11.86 20.4H27.62C28.86 20.4 29.5 19.2 29.5 18.36C29.5 17.52 29.18 16.56 30.14 15.6Z" fill="#0D91D6"/>
    <path d="M25.46 12.48L25.82 12.28C25.82 12.28 28.22 13.96 30.14 15.6C29.18 16.56 29.5 17.52 29.5 18.36C29.5 19.2 28.86 20.4 27.62 20.4H11.86C9.66 20.4 7.86 19.56 7.86 17.04C7.86 12.96 11.62 6.96 17.78 6.96C19.78 6.96 23.14 6.96 23.82 6.96C24.5 6.96 24.82 7.12 24.78 7.6C24.74 8.08 23.7 11.08 23.7 11.08C23.7 11.08 20.78 8.92 17.38 8.92C12.06 8.92 10.34 15.4 10.34 15.4H24.82C25.78 15.4 26.58 14.64 26.26 13.84C25.94 13.04 25.46 12.48 25.46 12.48Z" fill="#0D91D6"/>
  </svg>
)

const WechatPayIcon = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="24" rx="4" fill="#F9F9F9"/>
    <path d="M16.8 9.68C16.8 6.56 13.52 4 9.48 4C5.44 4 2.16 6.56 2.16 9.68C2.16 12.8 5.44 15.36 9.48 15.36C10.36 15.36 11.2 15.2 11.96 14.92L13.68 15.68L13.08 14.04C15.32 13 16.8 11.48 16.8 9.68Z" fill="#51B148"/>
    <path d="M9.48 6.92C8.88 6.92 8.4 7.4 8.4 7.96C8.4 8.52 8.88 9 9.48 9C10.08 9 10.56 8.52 10.56 7.96C10.56 7.4 10.08 6.92 9.48 6.92Z" fill="#51B148"/>
    <path d="M14.76 6.92C14.16 6.92 13.68 7.4 13.68 7.96C13.68 8.52 14.16 9 14.76 9C15.36 9 15.84 8.52 15.84 7.96C15.84 7.4 15.36 6.92 14.76 6.92Z" fill="#51B148"/>
    <path d="M35.84 14.32C35.84 11.68 32.92 9.52 29.36 9.52C25.8 9.52 22.88 11.68 22.88 14.32C22.88 16.96 25.8 19.12 29.36 19.12C30.12 19.12 30.84 19 31.52 18.76L33.04 19.4L32.52 18C34.48 17.12 35.84 15.8 35.84 14.32Z" fill="#51B148"/>
    <path d="M26.92 12.48C26.4 12.48 25.96 12.88 25.96 13.36C25.96 13.84 26.4 14.24 26.92 14.24C27.44 14.24 27.88 13.84 27.88 13.36C27.88 12.88 27.44 12.48 26.92 12.48Z" fill="#51B148"/>
    <path d="M31.8 12.48C31.28 12.48 30.84 12.88 30.84 13.36C30.84 13.84 31.28 14.24 31.8 14.24C32.32 14.24 32.76 13.84 32.76 13.36C32.76 12.88 32.32 12.48 31.8 12.48Z" fill="#51B148"/>
  </svg>
)

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('home')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer_desc', '您的一站式游戏中心，提供最新最热的游戏、资讯和互动社区。')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={t('social_twitter', 'Twitter')}>
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={t('social_instagram', 'Instagram')}>
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={t('social_facebook', 'Facebook')}>
                <FacebookIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quick_links', '快速链接')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-400 hover:text-white transition-colors">
                  {t('store')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-gray-400 hover:text-white transition-colors">
                  {t('games')}
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors">
                  {t('community')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('support', '支持')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  {t('help_center', '帮助中心')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  {t('faq', '常见问题')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('contact_us', '联系我们')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {t('privacy_policy', '隐私政策')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  {t('terms_of_service', '服务条款')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('subscribe_news', '订阅最新消息')}</h3>
            <p className="text-gray-400 mb-4">
              {t('subscribe_desc', '获取最新游戏资讯、优惠和活动通知。')}
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder={t('input_email', '输入您的邮箱')}
                className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                {t('subscribe', '订阅')}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {t('company_name', 'GameBox')}. {t('all_rights_reserved', '保留所有权利.')}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <VisaIcon className="h-8" />
            <MastercardIcon className="h-8" />
            <AlipayIcon className="h-8" />
            <WechatPayIcon className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  )
} 