import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export const runtime = 'nodejs';

/**
 * GET /api/reminders/history?invoiceId=xxx
 * Get reminder history for an invoice
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    const userId = searchParams.get('userId');

    if (!invoiceId || !userId) {
      return NextResponse.json(
        { error: 'invoiceId and userId are required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Fetch reminder history for this invoice
    const { data, error } = await supabaseAdmin
      .from('reminder_logs')
      .select('*')
      .eq('invoice_id', invoiceId)
      .eq('user_id', userId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch reminder history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reminder history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reminders: data || [],
    });
  } catch (error) {
    console.error('Reminder history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
