import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sql } = await req.json();
    
    if (!sql) {
      return NextResponse.json({ error: 'SQL 语句不能为空' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // 执行 SQL 语句
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('执行 SQL 失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API 错误:', error);
    return NextResponse.json({ error: '执行 SQL 发生错误' }, { status: 500 });
  }
} 