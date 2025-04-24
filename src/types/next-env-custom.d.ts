// 覆盖 Next.js 的 PageProps 类型，添加兼容性处理
declare module 'next' {
  export interface PageProps {
    params?: {
      [key: string]: string;
    };
    searchParams?: {
      [key: string]: string | string[] | undefined;
    };
  }
}

// 防止 checkFields 类型检查报错的修复
export {}; 