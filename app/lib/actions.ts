'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    console.log(customerId, amount, status);
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    console.log("Invoice created successfully");
    /**
     * 
     * 当新增发票后：
     * 数据库已更新，但页面显示的还是缓存的旧数据
     * 需要让 /dashboard/invoices 页面知道数据已经变化
     * revalidatePath 会触发这个路径下的所有服务器组件重新渲染
     * 
     */
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}